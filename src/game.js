import Player from './player.js';

class Game extends Phaser.Scene
{
    constructor()
	{
		super('Game');
	}

    init(data)
	{
		
	}

	preload()
	{
        //Placeholders
		this.load.image('cat', '../assets/cat.png');
        this.load.spritesheet('frank', '../assets/francat_spritesheet.png', { frameWidth: 28*4, frameHeight: 32*4 });
	}

    
	create(data)
	{ 
        this.keys1 = [ "W", "A", "S", "D" ]
        this.player1 = this.physics.add.existing(new Player(this, 50, 100, 'frank', 5, this.keys1));
        this.keys2 = [ "UP", "LEFT", "DOWN", "RIGHT" ]
        this.player2 = this.physics.add.existing(new Player(this, 450, 100, 'frank', 5, this.keys2));

        this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);
    }




	update(time, delta)
	{
       this.player1.updateMovement();
       this.player2.updateMovement();
	}

}

export default Game;
