class OnlinePowerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type){
        super(scene, x, y, 'Texture');

        this.scene = scene;

		let pos = [x,y];
        this.x = x;
        this.y = y;

		this.serverX = x;
		this.serverY = y;

        this.texture = texture;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.setScale(3);

        this.wielder = undefined; //checks which player picked the PowerUp
        //this.type = this.generateRandomType();
        this.type = type;

        // Power Up duration
        this.time = 0;
        this.duration = 0;
        this.picked = false;
        this.respawntime = 0;
        this.exploded = false;
		
		this.bombSfx = this.scene.sound.add('bomb');
		this.sfx = this.scene.sound.add('powerup');
    }

	getPosition()
	{
		let x, y;

		x = (Math.random() * (31 - 1) + 1) * 40;
		y = (Math.random() * (17 - 1) + 1) * 40;

		// Clamp values to the map's range
		if(x < 100) x = 100;
		else if (x > 1180) x = 1180;

		if(y < 180) y = 180;
		else if(y > 680) y = 680;

		return [x, y];
	}

    generateRandomType(){
        var type = ['Dash', 'Power', 'Bomb'];
        this.type = type[Math.floor(Math.random() * type.length)];  
        this.createAnimations(this.type); 
        //this.generateProperties();
    }

    createAnimations(type){
        switch (type){
            case 'Dash':
                this.scene.anims.create({
                    key: `Dash`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 0, end: 5 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            case 'Power':
                this.scene.anims.create({
                    key: `Power`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 6, end: 11 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            case 'Bomb':
                this.scene.anims.create({
                    key: `Bomb`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 12, end: 17 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            default: console.log(`Type ${type} not implemented`);
        }       
    }

    updatePowerup(player,x,y, delta, grid){
        this.sprite.anims.play(`${this.type}`, true);  

        var distance = this.manhattanDistance(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
        if(distance < 40 && this.sprite.visible){
            this.time += delta;
            if(this.time < 200){
                player.runAnimation(player,`${player.texture}-powerup`, 0, 0);
                if(this.duration < 5){        
                    console.log(`${player.name} picked ${this.type} up`);  
                }
                //this.sprite.enable = false;
                this.picked = true;
				this.wielder = player;
				this.sfx.play();
                this.sprite.setVisible(false);
            }                           
        } 

        if(this.picked && this.wielder == player){
            this.applyPowerup(player, delta, grid);
        }
        if (this.duration > 10000 && this.wielder == player) {
            this.respawn(delta,x,y);
        }
        
    }

	newPosition(data) {
		this.serverX = data[0];
		this.serverY = data[1];
	}

    applyPowerup(player, delta, grid){
        switch(this.type){
            case 'Dash':    
                player.velocity = player.initialVelocity*2;
                this.duration += delta;
                if(this.duration > 5000){        
                    player.velocity = 200;
				//this.sendMessage('S', [this.powerup3.x, this.powerup3.y]);

                }
            break;
            case 'Power':
                player.power = true;
                this.duration += delta;
                if(this.duration > 5000){        
                    player.power = false;
                }
            break;
            case 'Bomb':
				if(this.exploded) return;
				this.exploded = true;
				this.bombSfx.play();

                let x = Math.floor(this.x / 40);
                let y = Math.floor(this.y / 40);

                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        let box = grid.grid[x + i][y + j];

						if(box != undefined)
						{
							box.setPlayer(player);
                        	box.updateSprite(x + i, y + j, grid.grid);
						}
                    }
                }
                break;
            default: console.log(`Type ${this.type} not implemented`); 
        }
    }

    respawn(delta,x,y){
        /*this.sprite.setVisible(true);
        this.generateRandomType();
        this.sprite.enable = true;
        this.picked = false;
        this.time = 0;
        this.duration = 0;
        this.exploded = false;
		this.wielder = undefined;

		var pos = [x,y];

		this.x = pos[0];
		this.y = pos[1];

		this.sprite.x = pos[0];
		this.sprite.y = pos[1];*/
    }

    manhattanDistance(powerx, powery, playerx, playery){
        return Math.abs(powerx - playerx) + Math.abs(powery - playery);
    }
}

export default OnlinePowerup;

