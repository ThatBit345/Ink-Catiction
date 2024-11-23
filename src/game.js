import Grid from './grid.js';
import Player from './player.js';
import Powerup from './powerup.js';

class Game extends Phaser.Scene {
    constructor() {
		super('Game');
	}

    init(data) {
		
	}

	preload() {
        // Placeholders
		this.load.image('cat', '../assets/cat.png');
        this.load.image('box', '../assets/box.png');
        this.load.image('ink', '../assets/ink.png');

        // Final Sprites
        this.load.spritesheet('agata', '../assets/agata_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
        this.load.spritesheet('frank', '../assets/frank_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
        this.load.spritesheet('powerups', '../assets/powerups_spritesheet.png', { frameWidth: 16, frameHeight: 24 });        
    }
    
	create(data) {        
        // World Configuration
        this.grid = new Grid(this, 'ink');

        // Player 1 Configuration
        this.keys1 = [ "W", "A", "S", "D", "E" ]
        this.velocity1 = 200;
        this.player1 = this.physics.add.existing(new Player(this, 50, 100, 'frank', 1, this.keys1, this.velocity1, "0xfad927"));
        this.player1.setCollideWorldBounds(true);

        // Player 2 Configuration
        this.keys2 = [ "UP", "LEFT", "DOWN", "RIGHT", "SHIFT"]
        this.velocity2 = 200;
        this.player2 = this.physics.add.existing(new Player(this, 450, 100, 'agata', 2, this.keys2, this.velocity2, "0xfa27ba"));
        this.player2.setCollideWorldBounds(true);
        
        //this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);

        // PowerUps Configuration
        this.powerups = [[200, 100],[200, 200], [200, 300]];
        this.powerup1 = this.physics.add.existing(new Powerup(this, this.powerups[0][0], this.powerups[0][1], 'powerups'));
        this.powerup2 = this.physics.add.existing(new Powerup(this, this.powerups[1][0], this.powerups[1][1], 'powerups'));
        this.powerup3 = this.physics.add.existing(new Powerup(this, this.powerups[2][0], this.powerups[2][1], 'powerups'));

        this.timer = 0;
        this.rounds = 0;

        this.title1 = this.add.text(300, 50, ' ', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
        this.title2 = this.add.text(300, 150, ' ', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
    
    }
	update(time, delta) {
        this.timer = time / 1000; //Time in seconds

        this.countDown(this.timer, this.title1);
        if(this.timer < 2) {
            this.player1.runAnimation(this.player1, `${this.player1.texture}-teleport`, 0, 0);
            this.player2.runAnimation(this.player2, `${this.player2.texture}-teleport`, 0, 0);
            console.log("a");
        }
        else if(this.timer > 2 && this.timer < 7){
            this.player1.runAnimation(this.player1, `${this.player1.texture}-idle`, 0, 0);
            this.player2.runAnimation(this.player2, `${this.player2.texture}-idle`, 0, 0);
            console.log("a");
        }
        else {

            //Update grid
            this.grid.updateGrid(this.player1);
		    this.grid.updateGrid(this.player2);

            // Update both players basic movement
            this.player1.updateMovement(this.player1.velocity);
            this.player2.updateMovement(this.player2.velocity);  
        
            // Checks if any player hits the other one while attacking
            this.player1.checkCollission(this.player2, delta);
            this.player2.checkCollission(this.player1, delta);

            // Interactions between Players and Power Ups
            this.powerup1.updatePowerup(this.player1, delta);
            this.powerup2.updatePowerup(this.player1, delta);
            this.powerup3.updatePowerup(this.player1, delta);
            this.powerup1.updatePowerup(this.player2, delta);
            this.powerup2.updatePowerup(this.player2, delta);
            this.powerup3.updatePowerup(this.player2, delta);
        }    
       
	}

    finishGame() {
		this.grid.countColors();
	}

    countDown(timer, title){
        if(timer < 5){
            this.uiTimer(title, 6, 'backwards');
        }
        else if(timer >= 6 && timer < 7 ){
            title.setText('GO!');
                    
        }
        else if(timer >= 7 ){
            title.visible = false; 
        }
    }

    uiTimer(title, start, run){
        switch (run){
            case 'forward':
                title.setText(` ${this.timer.toFixed(0)} `); 
                break;
            case 'backwards':
                title.setText(` ${start - this.timer.toFixed(0)} `); 
                break;
            default:
        }      
    }
}

export default Game;
