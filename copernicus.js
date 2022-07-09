// Fixed settings:
let t = 0;
let scale = 100;
let timeScale = 50;
let size = 2000;

// Game state:
let zoom = 1;
let center = 0;

let planets, background;
let centerPlanet, centerX, centerY;

let game = new Phaser.Game(size, size, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// Body menu:
function setCenterBody(i) {
	background.clear();
	center = i;
}

// Zoom buttons:
function setZoom(z) {
	zoom += z;
	document.querySelector("canvas").style.zoom = zoom;
}

// Planet calculate X position from orbit
Phaser.Sprite.prototype.calculateX = function (t) {
	return scale * this.distance * Math.sin(t * Math.PI / timeScale / this.period);
}

// Planet calculate Y position from orbit
Phaser.Sprite.prototype.calculateY = function (t) {
	return scale * this.distance * Math.cos(t * Math.PI / timeScale / this.period);
}

// Planet update position in game
Phaser.Sprite.prototype.updatePosition = function () {
	this.y = (this == centerPlanet) ? 0 : this.calculateX(t) - centerX;
	this.x = (this == centerPlanet) ? 0 : this.calculateY(t) - centerY;

	// Draw the trail.
	background.context.fillRect(this.x + size / 2, this.y + size / 2, 1, 1);
	background.dirty = true;
}

// Preload
function preload() {
	game.load.baseURL = 'http://examples.phaser.io/assets/';
	game.load.crossOrigin = 'anonymous';

	game.load.image('sun', 'sprites/yellow_ball.png');
	game.load.image('earth', 'sprites/green_ball.png');
	game.load.image('moon', 'sprites/blue_ball.png');
}

// Set up game
function create() {

	let newPlanet = function(image, distance, period) {
		let planet = game.add.sprite(distance, 0, image);
		planet.width = planet.height = 10;
		planet.distance = distance;
		planet.period = period;
		planet.anchor.set(0.5);
		return planet;
	}

	// Planet, radius, period
	planets = [
		newPlanet('sun', 0, 1),
		newPlanet('earth', .39, .24),
		newPlanet('earth', .72, .62),
		newPlanet('earth', 1, 1),
		newPlanet('earth', 1.52, 1.88),
		newPlanet('earth', 5.20, 11.86),
		newPlanet('earth', 9.54, 29.46)
	];

	background = game.add.bitmapData(game.world.bounds.width, game.world.bounds.height);
	background.context.fillStyle = '#ffffff';

	game.world.setBounds(-size, -size, 2 * size, 2 * size);
	game.add.sprite(-size/2, -size/2, background);
	game.camera.x = -size/2;
	game.camera.y = -size/2;
}

// Each frame, update planet positions.
function update() {
	t++;
	centerPlanet = planets[center];
	centerX = centerPlanet.calculateX(t);
	centerY = centerPlanet.calculateY(t);
	for (let i in planets) {
		planets[i].updatePosition();
	}
}
