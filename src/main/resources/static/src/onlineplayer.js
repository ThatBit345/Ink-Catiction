import PlayerStats from './playerStats.js'

class OnlinePlayer extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, x, y, otherId, texture, color){
        super(scene, x, y, 'Texture');

        this.scene = scene;
        this.texture = texture;

		if(otherId == 1) this.name = "Player 2";
		else this.name = "Player 1";
		this.x = x;
		this.y = y;

		this.serverX = x;
		this.serverY = y;

        this.color = color;
        this.initialVelocity = 200;
        this.velocity = 200;
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.setScale(3.5);
        this.sprite.depth = 1;
        this.direction;
        this.getInitialDirection(x);
        this.createAnimations();
		this.lifes = 4;
        this.stat_x;
        this.stat_y;
		this.sphaghettiPos();
        this.stats = new PlayerStats(this.scene, this.stat_x, this.stat_y, `heart_${this.texture}`, this.lifes);

        this.isAnimating = false;
        this.isAttacking = false;

		this.dead = false;

        // Handle the Animation timing
		this.power = false;
        this.powerup = false; // Has a powerup
        this.cont = 0;
        this.clock = 0;
        this.respawnclock = 0;

		this.hitSfx = this.scene.sound.add('hit');
    }

	sphaghettiPos(){
        if(this.name == `Player 1`){
            this.stat_x = 33;
            this.stat_y = 125;
        }
        else {
            this.stat_x = 1143;
            this.stat_y = 125;
        }
    }

    // Create PLayer configuration
    getInitialDirection(x){
        this.direction = x < 640 ? 'right' : 'left';
    }

    createAnimations(){
        this.scene.anims.create({
            key: `${this.texture}-idle`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: `${this.texture}-move`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.texture}-teleport`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 12, end: 23 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: `${this.texture}-powerup`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 24, end: 29 }),
            frameRate: 14,
            repeat: 0
        });

        this.scene.anims.create({
            key: `${this.texture}-hit`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 30, end: 33 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: `${this.texture}-attack`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 34, end: 39 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: `${this.texture}-die`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 40, end: 48 }),
            frameRate: 8,
            repeat: 0
        });
    }

	updatePosition(data)
	{
		this.serverX = data[0];
		this.serverY = data[1];
	}

	calculateMovement()
	{
		let x = this.sprite.x;
		let y = this.sprite.y;

		let xDiff = x - this.serverX;
		let yDiff = y - this.serverY;

		let deadzone = 0.05;

		if(xDiff > -deadzone && xDiff < deadzone) xDiff = 0;
		if(yDiff > -deadzone && yDiff < deadzone) yDiff = 0;

		if(xDiff == 0 && yDiff == 0)
		{
			this.runMovement(`${this.texture}-idle`, 0, 0);
		}
		else
		{
			if (xDiff > 0) this.direction = 'left';
			else if (xDiff < 0) this.direction = 'right';

			this.runMovement(`${this.texture}-move`, -Math.sign(xDiff) * this.velocity, -Math.sign(yDiff) * this.velocity);
		}
	}

    // Special animations
    runAnimation(player, animation, x, y){
        player.isAnimating = true;
        player.sprite.setVelocityX(x);
        player.sprite.setVelocityY(y);
        this.checkDirection();
        player.sprite.play(animation, true);                   
        player.sprite.on('animationcomplete', () => {
            player.isAnimating = false;
        });  
    }

    // Basic Movement
    runMovement(animation, x, y){
		if(this.isAnimating) return;
        this.checkDirection();
        this.sprite.setVelocityX(x);
        this.sprite.setVelocityY(y);
        this.sprite.anims.play(animation, true);  
    }

    checkDirection(){
        this.sprite.flipX = this.direction == 'left' ? true : false;
    }

    updateMovement(velocity){
		//console.log(this.x);

        // Attack animation
        if(this.controls[4].isDown && this.isAttacking && this.power){  
            this.runAnimation(this, `${this.texture}-attack`, 0, 0);                  
        }
        else if(this.controls[4].isDown && !this.isAttacking && !this.isAnimating){
            this.isAttacking = true;  
            this.runAnimation(this, `${this.texture}-attack`, 0, 0);                  
        }
        else if(this.controls[4].isUp && this.isAttacking && !this.power){
            this.isAttacking = false;
        }

        // If not busy doing other animations
        if(!this.isAnimating){
            // Up Movement
            if (this.controls[0].isDown && this.sprite.y > 180){               
                this.runMovement(`${this.texture}-move`, 0, -velocity);
            }
            // Left movement
            else if (this.controls[1].isDown && this.sprite.x > 100) {
                this.runMovement(`${this.texture}-move`, -velocity, 0);
                this.direction = 'left';
            } 
            // Down movement
            else if (this.controls[2].isDown && this.sprite.y < 680){
                this.runMovement(`${this.texture}-move`, 0, velocity);
            }
            // Right Movement
            else if (this.controls[3].isDown && this.sprite.x < 1180) {
                this.runMovement(`${this.texture}-move`, velocity, 0);
                this.direction = 'right';
            }          
            // If player does not click any key
            else {
                this.runMovement(`${this.texture}-idle`, 0, 0);
            }
        }       
    }

	resetState()
	{
		this.runMovement(`${this.texture}-idle`, 0, 0);
		this.sprite.setVelocityX(0);
		this.sprite.setVelocityY(0);
	}

	attack(other)
	{
		this.isAttacking = true;
		this.runAnimation(this, `${this.texture}-attack`, 0, 0);

		var distance = this.chevyshevDistance(this.sprite.x, this.sprite.y, other.sprite.x, other.sprite.y);

		if(distance < 80 && this.isAttacking && this.cont < 1){
			console.log("hit other player");
            this.runAnimation(other,`${other.texture}-hit`, 0, 0);
			this.hitSfx.play();
		}
	}

    deathSequence()
	{
		this.isAnimating = true;
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);
        this.checkDirection();
        this.sprite.play(`${this.texture}-die`, true);                   
        this.sprite.on('animationcomplete', () => {
			console.log("death");
			this.isAnimating = false;
        }); 
		this.dead = true;
    }

	respawn()
	{
		this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.runAnimation(this,`${this.texture}-teleport`,0, 0);
		this.dead = false;
        this.lifes = 4;
		this.respawnclock = 0;
        this.deaths++; 
	}

    chevyshevDistance(x1, y1, x2, y2){
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        //return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

	getCharacter()
	{
		return this.texture;
	}
}

export default OnlinePlayer;
