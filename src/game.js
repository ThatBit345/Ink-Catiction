import Player from './player.js';
import Grid from './grid.js';

class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	init(data) {

	}

	preload() {
		//Placeholders
		this.load.image('cat', '../assets/cat.png');
		this.load.spritesheet('agata', '../assets/agata_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
		this.load.spritesheet('frank', '../assets/frank_spritesheet.png', { frameWidth: 78, frameHeight: 88 });

		this.load.image('box', '../assets/box.png');
	}

	create(data) {
		this.grid = new Grid(this, 'box');
		this.keys1 = ["W", "A", "S", "D", "E"];

		this.player1 = this.physics.add.existing(new Player(this, 32, 28, 'frank', 1, this.keys1, "0xfad927"));
		this.velocity1 = 200;
		this.player1.setCollideWorldBounds(true);

		//Player 2 Configuration
		this.keys2 = ["UP", "LEFT", "DOWN", "RIGHT", "SHIFT"];
		this.player2 = this.physics.add.existing(new Player(this, 1252, 656, 'agata', 2, this.keys2, "0xfa27ba"));
		this.velocity2 = 200;
		this.player2.setCollideWorldBounds(true);

		//this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);
	}

	update(time, delta) {
		this.grid.updateGrid(this.player1);
		this.grid.updateGrid(this.player2);

		// Update both players basic movement
		this.player1.updateMovement(this.velocity1);
		this.player2.updateMovement(this.velocity2);

		// Checks if any player hits the other one while attacking
		this.player1.checkCollission(this.player2, delta);
		this.player2.checkCollission(this.player1, delta);
		//let timer = this.time.delayedCall(500, finishGame); // delay in ms
	}

	finishGame() {
		this.grid.countColors();
	}
}

export default Game;
