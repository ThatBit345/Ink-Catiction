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
        this.load.spritesheet('agata', '../assets/agata_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
        this.load.spritesheet('frank', '../assets/frank_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
	}
    
	create(data)
	{ 
	this.player1 = this.physics.add.existing(new Player(this, 50, 100, 'frank', 1, this.keys1));
        this.velocity1 = 200;
        this.player1.setCollideWorldBounds(true);

        //Player 2 Configuration
        this.keys2 = [ "UP", "LEFT", "DOWN", "RIGHT", "SHIFT"]
        this.player2 = this.physics.add.existing(new Player(this, 450, 100, 'agata', 2, this.keys2));
        this.velocity2 = 200;
        this.player2.setCollideWorldBounds(true);
        
        this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);
    	}

	update(time, delta)
	{
        // Update both players basic movement
        this.player1.updateMovement(this.velocity1);
        this.player2.updateMovement(this.velocity2);  
       
        // Checks if any player hits the other one while attacking
        this.player1.checkCollission(this.player2, delta);
        this.player2.checkCollission(this.player1, delta);
	}
}

export default Game;
