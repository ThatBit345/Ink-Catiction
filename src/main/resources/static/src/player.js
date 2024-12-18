class Player extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, x, y, texture, number, keys, velocity, color){
        super(scene, x, y, 'Texture');

        this.scene = scene;
        this.texture = texture;

		this.x = x;
		this.y = y;

        this.name = `Player ${number}`;
        this.color = color;
        this.initialVelocity = velocity;
        this.velocity = velocity;
        this.lifes = 4;
        this.deaths = 0;
        this.addKeys(keys);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.depth = 1;
        this.direction;
        this.getInitialDirection(number);
        this.createAnimations();

        this.isAnimating = false;
        this.isAttacking = false;

        console.log(`${this.name} currently playing ${this.texture}: created successfully!`);
        console.log(`Using controls ${keys}`);

        // Handle the Animation timing
        this.power = false; // If Player holds Stamina PowerUp
        this.cont = 0;
        this.clock = 0;
        this.respawnclock = 0;

		this.hitSfx = this.scene.sound.add('hit');
    }

    // Create PLayer configuration
    addKeys(keys){
        this.controls = [];
        for (var i = 0; i < keys.length; i++){
            this.controls.push( this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[i]]));
        }    
    }

    getInitialDirection(number){
        this.direction = (number-1) % 2 == 0 ? 'right' : 'left';
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

    checkCollission(other, delta){
        this.clock += delta;
        this.clockHandling(delta);
        this.updateCollission(other, delta);
    }

    clockHandling(delta){
        if(this.power) {
            this.clock = 0;
            this.cont = 0;
        }
        else if(!this.power && this.clock > 200){
            this.cont = 0;
            this.clock = 0;
        }
        while(this.controls[4].isDown && this.clock > 0 && !this.power){
            this.clock -= delta;
        } 
    }

    updateCollission(other, delta){
        var distance = this.chevyshevDistance(this.sprite.x, this.sprite.y, other.sprite.x, other.sprite.y);

        if(distance < 80 && this.isAttacking && this.cont < 1){
            this.runAnimation(other,`${other.texture}-hit`, 0, 0);
			this.hitSfx.play();
            console.log(`${this.name} attacked ${other.name}`);      
            this.cont++;
            if(this.cont >= 1){
                other.lifes--;
                this.isAttacking = false;
                this.clock = 0;   
            }
        }  
        
        // If Player kills other player
        if (other.lifes <= 0) { 
            other.respawnclock += delta;           
            if(this.power){
                this.deathSequence(other, 400, 1200);
            }
            else {
                this.deathSequence(other, 800, 1800);
            }
        }
    }

	resetState()
	{
		this.runMovement(`${this.texture}-idle`, 0, 0);
		this.sprite.setVelocityX(0);
		this.sprite.setVelocityY(0);
	}

    deathSequence(other, a, b){
        if(other.respawnclock > 1 && other.respawnclock < 400){
            this.runAnimation(other,`${other.texture}-hit`, 0, 0);  
        }
        if (other.respawnclock > a ) {   
            this.runAnimation(other,`${other.texture}-die`, 0, 0);                     
        }
        if(other.respawnclock > b ) {
            other.sprite.x = other.x;
            other.sprite.y = other.y;
            this.runAnimation(other,`${other.texture}-teleport`,0, 0);
            other.lifes = 4;   
            other.respawnclock = 0;    
            other.deaths++;
            console.log(other.deaths);      
        } 
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

export default Player;
