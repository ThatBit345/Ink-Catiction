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
	}

    
	create(data)
	{ 
        this.player1 = this.physics.add.sprite(100, 450, 'cat');
        this.keys = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D) 
        ]

        this.player2 = this.physics.add.sprite(500, 450, 'cat');
        this.cursors = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT), 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN), 
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT) 
        ]
        this.collission = this.physics.add.collider(this.player1, this.player2);
    }

	update(time, delta)
	{
		this.updatePos(this.player1, this.keys);
        this.updatePos(this.player2, this.cursors);
       
	}

    updatePos(player, vec){
        var velocity = 200;

        if (vec[0].isDown){
            player.setVelocityX(0);
            player.setVelocityY(-velocity);
        }
        else if (vec[1].isDown)
        {
            player.setVelocityX(-velocity);
            player.setVelocityY(0);
            //this.anims.play('left', true);
        } 
        else if (vec[2].isDown){
            player.setVelocityX(0);
            player.setVelocityY(velocity);
        }
        else if (vec[3].isDown)
        {
            player.setVelocityX(velocity);
            player.setVelocityY(0);
        }      
        else {
            player.setVelocityX(0);
            player.setVelocityY(0);
        }
    }
}

export default Game;