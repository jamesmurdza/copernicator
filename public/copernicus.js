let t = 0;
let scale = 100;
let timeScale = 50;

let zoom = 1;
let size = 2000;
let game, planets, center, bmd, centerX, centerY;

function setCenterBody(i) {
	bmd.clear();
	center = planets[i];
}

function setZoom(z) {
	zoom = z;
	document.body.children[2].style.zoom = zoom;
}
Phaser.Sprite.prototype.calculateX = function (t) {
	return scale * this.distance * Math.sin(t * Math.PI / timeScale / this.period);
}

Phaser.Sprite.prototype.calculateY = function (t) {
	return scale * this.distance * Math.cos(t * Math.PI / timeScale / this.period);
}
Phaser.Sprite.prototype.updatePosition = function () {
	this.y = (this == center) ? 0 : this.calculateX(t) - centerX;
	this.x = (this == center) ? 0 : this.calculateY(t) - centerY;

	// Draw the trail.
	bmd.context.fillRect(this.x + size / 2, this.y + size / 2, 1, 1);
	bmd.dirty = true;
}

window.onload = function () {

	game = new Phaser.Game(size, size, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

		game.load.baseURL = 'http://examples.phaser.io/assets/';
		game.load.crossOrigin = 'anonymous';

		game.load.image('sun', 'sprites/yellow_ball.png');
		game.load.image('earth', 'sprites/green_ball.png');
		game.load.image('moon', 'sprites/blue_ball.png');
	}


	function newPlanet(image, distance, period) {
		var planet = game.add.sprite(distance, 0, image);
		planet.width = planet.height = 10;
		planet.distance = distance;
		planet.period = period;
		planet.anchor.set(0.5);
		return planet;
	}

	function create() {
		game.world.setBounds(-size, -size, 2 * size, 2 * size);

		t = 0;

		planets = [
			newPlanet('sun', 0, 1),
			newPlanet('earth', .39, .24),
			newPlanet('earth', .72, .62),
			newPlanet('earth', 1, 1),
			newPlanet('earth', 1.52, 1.88),
			newPlanet('earth', 5.20, 11.86),
			newPlanet('earth', 9.54, 29.46)
		];

		bmd = game.add.bitmapData(game.world.bounds.width, game.world.bounds.height);
		bmd.context.fillStyle = '#ffffff';

		var bg = game.add.sprite(-size / 2, -size / 2, bmd);

		game.camera.x = -size / 2;
		game.camera.y = -size / 2;
		setCenterBody(0);
	}

	function update() {
		t++;
		centerX = center.calculateX(t);
		centerY = center.calculateY(t);
		for (var i in planets) {
			planets[i].updatePosition();
		}
	}

};

