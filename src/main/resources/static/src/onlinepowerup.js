class OnlinePowerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type){
        super(scene, x, y, 'Texture');

        this.scene = scene;

        this.x = x;
        this.y = y;

		this.bombX = this.x;
		this.bombY = this.y;

		this.bomb = [this.x,this.y];

        this.texture = texture;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.setScale(3);
        this.sprite.depth = 2;

        this.type = type;
		this.createAnimations(type);

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
		else if(y > 600) y = 600;

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
            case 'DASH':
                this.scene.anims.create({
                    key: `DASH`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 0, end: 5 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            case 'POWER':
                this.scene.anims.create({
                    key: `POWER`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 6, end: 11 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            case 'BOMB':
                this.scene.anims.create({
                    key: `BOMB`,
                    frames: this.scene.anims.generateFrameNumbers(`powerups`, { start: 12, end: 17 }),
                    frameRate: 10,
                    repeat: -1
                });
            break;
            default: console.log(`Type ${type} not implemented`);
        }       
    }

    updatePowerup()
	{
        this.sprite.anims.play(`${this.type}`, true);  
    }

    applyPowerup(player, grid){
        switch(this.type){
            case 'DASH':    
				this.sfx.play();
                player.velocity = player.initialVelocity*2;
                player.runAnimation(player,`${player.texture}-powerup`, 0, 0);
				this.sprite.setVisible(false);
            break;

            case 'POWER':
				this.sfx.play();
                player.power = true;
                player.runAnimation(player,`${player.texture}-powerup`, 0, 0);
				this.sprite.setVisible(false);
            break;

            case 'BOMB':
				this.bombSfx.play();
				this.sprite.setVisible(false);

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

    respawn(data){
		console.log("POWERUP RESPAWNING");
        this.sprite.setVisible(true);
		this.type = data[2];
		this.createAnimations(this.type);
        this.sprite.enable = true;

		var pos = data;

		this.x = pos[0];
		this.y = pos[1];

		this.sprite.x = pos[0];
		this.sprite.y = pos[1];
    }

    manhattanDistance(powerx, powery, playerx, playery){
        return Math.abs(powerx - playerx) + Math.abs(powery - playery);
    }
}

export default OnlinePowerup;

