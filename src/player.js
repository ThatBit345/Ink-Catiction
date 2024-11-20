class Player extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, x, y, texture, number, keys){
        super(scene, x, y, 'Texture');

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;

        this.name = `Player ${number}`;
        this.life = 4;
        this.deaths = 0;
        this.addKeys(keys);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.direction = this.getInitialDirection(number);
        
        this.createAnimations();
        this.isAnimating = false;
        this.isAttacking = false;

        console.log(`${this.name} currently playing ${this.texture}: created successfully!`);
        console.log(`Using controls ${keys}`);

        // Manage animations
        this.cont = 0;
        this.clock = 0;
        this.respawnclock = 0;
    }

    addKeys(keys){
        this.controls = [];
        for (var i = 0; i < keys.length; i++){
            this.controls.push( this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[i]]));
        }    
    }

    getInitialDirection(n){
        if((n-1) % 2 == 0){
            return 'right';
        }
        else{
           return 'left';
        }
    }

    createAnimations(){
        this.scene.anims.create({
            key: `${this.texture}-idle`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
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
            frameRate: 10,
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
        if(this.direction == 'left'){
            this.sprite.flipX = true;
        }
        else {
            this.sprite.flipX = false;
        }
    }

    updateMovement(velocity){
        // Attack animation
        if(this.controls[4].isDown && !this.isAttacking){
            this.isAttacking = true;  
            this.runAnimation(this, `${this.texture}-attack`, 0, 0);                  
        }
        else if(this.controls[4].isUp && this.isAttacking){
            this.isAttacking = false;
        }

        // If not busy doing other animations
        if(!this.isAnimating){
            // Up Movement
            if (this.controls[0].isDown){               
                this.runMovement(`${this.texture}-move`, 0, -velocity);
            }
            // Left movement
            else if (this.controls[1].isDown) {
                this.runMovement(`${this.texture}-move`, -velocity, 0);
                this.direction = 'left';
            } 

            // Down movement
            else if (this.controls[2].isDown){
                this.runMovement(`${this.texture}-move`, 0, velocity);
            }
            // Right Movement
            else if (this.controls[3].isDown) {
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
        this.clockRestart(delta);
        this.updateCollission(other, delta);
    }

    clockRestart(delta){
        if(this.clock > 200){
            this.cont = 0;
            this.clock = 0;
        }
        while(this.controls[4].isDown && this.clock > 0){
            this.clock -= delta;
        } 
    }

    updateCollission(other, delta){
        var distance = this.manhattanDistance(this.sprite.x, this.sprite.y, other.sprite.x, other.sprite.y);
        if(distance < 85 && this.isAttacking && this.cont < 1){
            this.runAnimation(other,`${other.texture}-hit`, 0, 0);
            console.log(`${this.name} attacked ${other.name}`);      
            this.cont++;
            if(this.cont == 1){
                other.life--;
                this.isAttacking = false;
                this.clock = 0;   
            }
            console.log(other.life);
        }       

        if (other.life <= 0){ 
            other.respawnclock += delta;
            if(other.respawnclock > 1 && other.respawnclock < 400 ){
                this.runAnimation(other,`${other.texture}-hit`, 0, 0);  
            }
            if(other.respawnclock > 800) {   
                this.runAnimation(other,`${other.texture}-die`, 0, 0);                     
            }

            if(other.respawnclock > 1800) {
                other.sprite.x = other.x;
                other.sprite.y = other.y;
                this.runAnimation(other,`${other.texture}-teleport`,0, 0);
                other.life = 4;   
                other.respawnclock = 0;    
                other.deaths++;
                console.log(other.deaths);       
            }           
        }
    }

    manhattanDistance(x1, y1, x2, y2){
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}

export default Player;
