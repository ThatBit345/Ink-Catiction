import Game from './game.js';

 class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, texture, number, keys, color){
        super(scene, x, y, 'Texture');

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;

        this.color = color;

        this.name = `Player ${number}`;

        this.addKeys(keys);

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);

        this.direction = this.getInitialDirection(number);
        this.createAnimations();
        
        console.log(`${this.name} currently playing ${this.texture}: created successfully!`);
    }

    addKeys(keys){
        this.controls = [  
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[0]]),
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[1]]), 
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[2]]), 
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[3]]) 
        ]
    }

    getInitialDirection(n){
        // Por si acaso se nos va la olla y hacemos +2 jugadores
        if(n % 2 == 0){
            return 'right';
        }
        else{
            return 'left';
        }
    }

    createAnimations(){
        this.scene.anims.create({
            key: `${this.texture}-idle_right`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.texture}-idle_left`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.texture}-move_right`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.texture}-move_left`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 18, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
    }

    updateMovement(){
        var velocity = 300;

        if (this.controls[0].isDown){
            //this.y-velocity;
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(-velocity);
            this.upDownMovement();
        }
        else if (this.controls[1].isDown)
        {
            //this.x-velocity;
            this.sprite.setVelocityX(-velocity);
            this.sprite.setVelocityY(0);
            this.sprite.anims.play(`${this.texture}-move_left`, true);
            this.direction = 'left';
        } 
        else if (this.controls[2].isDown){
            //this.y+velocity;
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(velocity);
            this.upDownMovement();
        }
        else if (this.controls[3].isDown)
        {
            //this.x+velocity;
            this.sprite.setVelocityX(velocity);
            this.sprite.setVelocityY(0);
            this.sprite.anims.play(`${this.texture}-move_right`, true);
            this.direction = 'right';
        }   
        else if (this.direction == 'right') {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            this.sprite.anims.play(`${this.texture}-idle_right`, true);
        }
        else if (this.direction == 'left') {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            this.sprite.anims.play(`${this.texture}-idle_left`, true);
        }
    }

    upDownMovement(){
        if(this.direction == 'left'){
            this.sprite.anims.play(`${this.texture}-move_left`, true);
        }
        else {
            this.sprite.anims.play(`${this.texture}-move_right`, true);
        }
    }
}

export default Player;