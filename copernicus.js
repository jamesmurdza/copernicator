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

// Preload
function preload() {
	game.load.baseURL = 'http://examples.phaser.io/assets/';
	game.load.crossOrigin = 'anonymous';
}

// Set up game
function create() {

	let newPlanet = function(color, distance, period) {
		let planet = game.add.graphics(0, 0);
		planet.beginFill(color, 1);
		planet.drawCircle(0, 0, 10);
		planet.endFill();
		planet.distance = distance;
		planet.period = period;
		
		planet.calculateX = function (t) {
			return scale * this.distance * Math.sin(t * Math.PI / timeScale / this.period);
		}
		
		planet.calculateY = function (t) {
			return scale * this.distance * Math.cos(t * Math.PI / timeScale / this.period);
		}
		
		planet.updatePosition = function () {
			this.y = (this == centerPlanet) ? 0 : this.calculateX(t) - centerX;
			this.x = (this == centerPlanet) ? 0 : this.calculateY(t) - centerY;
	
			// Draw the trail.
			background.context.fillRect(this.x + size / 2, this.y + size / 2, 1, 1);
			background.dirty = true;
		}
		// planet.anchor.set(0.5);
		return planet;
	}

	// Planet, radius, period
	planets = [
		newPlanet(0xffff00, 0, 1),
		newPlanet(0xff0000, .39, .24),
		newPlanet(0xcccccc, .72, .62),
		newPlanet(0x0000ff, 1, 1),
		newPlanet(0xff8800, 1.52, 1.88),
		newPlanet(0x00ff00, 5.20, 11.86),
		newPlanet(0x8800ff, 9.54, 29.46)
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
