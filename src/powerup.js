class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, 'Texture');

        this.scene = scene;

		let pos = this.getPosition();
        this.x = pos[0];
        this.y = pos[1];

        this.texture = texture;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.setScale(3);
        this.type;
        this.generateRandomType();

        // Power Up duration
        this.time = 0;
        this.duration = 0;
        this.picked = false;
        this.respawntime = 0;
        this.exploded = false;
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

    updatePowerup(player, delta, grid){
        this.sprite.anims.play(`${this.type}`, true);  

        var distance = this.manhattanDistance(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
        if(distance < 40){
            this.time += delta;
            if(this.time < 200){
                player.runAnimation(player,`${player.texture}-powerup`, 0, 0);
                if(this.duration < 5){        
                    console.log(`${player.name} picked ${this.type} up`);  
                }
                //this.sprite.enable = false;
                this.picked = true;
                this.sprite.setVisible(false);
            }                           
        } 

        if(this.picked){
            this.applyPowerup(player, delta, grid);        
        }
        if (this.duration > 10000 ) {
            this.respawn(delta);
        }
        
    }

    applyPowerup(player, delta, grid){
        switch(this.type){
            case 'Dash':    
                player.velocity = player.initialVelocity*2;
                this.duration += delta;
                if(this.duration > 5000){        
                    player.velocity = 200;
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
            default: console.log(`Type ${type} not implemented`); 
        }
    }

    respawn(delta){
        this.sprite.setVisible(true);
        this.generateRandomType();
        this.sprite.enable = true;
        this.picked = false;
        this.time = 0;
        this.duration = 0;
        this.exploded = false;
    }

    manhattanDistance(powerx, powery, playerx, playery){
        return Math.abs(powerx - playerx) + Math.abs(powery - playery);
    }
}

export default Powerup

