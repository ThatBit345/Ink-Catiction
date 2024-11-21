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
		this.load.spritesheet('frank', '../assets/francat_spritesheet.png', { frameWidth: 28 * 4, frameHeight: 32 * 4 });

		this.load.image('box', '../assets/box.png');
		this.load.image('inkFrancat', '../assets/ink_francat.png');
		this.load.image('inkAgata', '../assets/ink_agata.png');
		this.load.image('default', '../assets/default.png');
	}

	create(data) {
		this.grid = new Grid(this,'box');

		this.keys1 = ["W", "A", "S", "D"]
		this.player1 = this.physics.add.existing(new Player(this, 32, 28, 'frank', 5, this.keys1, 'inkFrancat'));
		this.keys2 = ["UP", "LEFT", "DOWN", "RIGHT"]
		this.player2 = this.physics.add.existing(new Player(this, 1252, 656, 'frank', 5, this.keys2, 'inkAgata'));

		//this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);
	}

	update(time, delta) {
		//this.grid.setImage('inkFrancat');
		//this.grid.setImage('inkAgata');
		//this.grid.drawGrid(this.player1.sprite.x, this.player1.sprite.y);
		//this.grid.drawGrid(this.player2.sprite.x, this.player2.sprite.y);
		//this.player2.drawPath();
		this.player1.updateMovement();
		this.player2.updateMovement();
		this.grid.updateGrid(this.player1);
		this.grid.updateGrid(this.player2);
	}
}

export default Game;
