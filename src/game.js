import Grid from './grid.js';
import Player from './player.js';
import Powerup from './powerup.js';

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.player1_character = data.player1;
        this.player2_character = data.player2;

        this.player1_ink = this.getPlayerColor(this.player1_character);
        this.player2_ink = this.getPlayerColor(this.player2_character);

        this.setTimeStart = 1;
        
		this.over = false;
    }

    preload() {
        // Placeholders
        this.load.image('cat', '../assets/cat.png');
        this.load.image('box', '../assets/box.png');

		this.load.image('endcard', '../assets/ui/spr_endcard_back.png');

        this.load.image('ink', '../assets/ink.png');

        // Final Sprites
        this.load.spritesheet('agata', '../assets/agata_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
        this.load.spritesheet('frank', '../assets/frank_spritesheet.png', { frameWidth: 78, frameHeight: 88 });
        this.load.spritesheet('powerups', '../assets/powerups_spritesheet.png', { frameWidth: 16, frameHeight: 24 });
    }

    create(data) {
        // World Configuration
        this.grid = new Grid(this, 'ink');


        this.initTime = 0;
        this.gameDuration = 15;

        // Player 1 Configuration
        this.keys1 = ["W", "A", "S", "D", "E"]
        this.velocity1 = 200;
        this.player1 = this.physics.add.existing(new Player(this, 50, 100, this.player1_character, 1, this.keys1, this.velocity1, this.player1_ink));
        this.player1.setCollideWorldBounds(true);

        // Player 2 Configuration
        this.keys2 = ["UP", "LEFT", "DOWN", "RIGHT", "SHIFT"]
        this.velocity2 = 200;
        this.player2 = this.physics.add.existing(new Player(this, 450, 100, this.player2_character, 2, this.keys2, this.velocity2, this.player2_ink));
        this.player2.setCollideWorldBounds(true);

        //this.collission = this.physics.add.collider(this.player1.sprite, this.player2.sprite);

        // PowerUps Configuration
        this.powerups = [[200, 100], [200, 200], [200, 300]];
        this.powerup1 = this.physics.add.existing(new Powerup(this, this.powerups[0][0], this.powerups[0][1], 'powerups'));
        this.powerup2 = this.physics.add.existing(new Powerup(this, this.powerups[1][0], this.powerups[1][1], 'powerups'));
        this.powerup3 = this.physics.add.existing(new Powerup(this, this.powerups[2][0], this.powerups[2][1], 'powerups'));

        this.timer = 0;
        this.rounds = 0;

        this.title1 = this.add.text(300, 50, ' ', { color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous' });
        this.title2 = this.add.text(300, 150, ' ', { color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous' });

        this.timeText = this.add.text(600, 150, ' ', { color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous' });
        
		this.endcard_upper = this.add.image(-922, 1117, 'endcard');
		this.endcard_upper.angle = -28.6;
		this.endcard_upper.depth = 10;

		this.endcard_text_upper = this.add.text(-1015.7, 1140.3, "Game's", { color: '#452600', fontSize: '30pt', fontFamily: 'Metamorphous' });
		this.endcard_text_upper.angle = -28.6;
		this.endcard_text_upper.depth = 10;

		this.endcard_lower = this.add.image(2203, -463, 'endcard');
		this.endcard_lower.angle = -28.6;
		this.endcard_lower.depth = 10;

		this.endcard_text_lower = this.add.text(2193, -481.1, "Over!", { color: '#452600', fontSize: '30pt', fontFamily: 'Metamorphous' });
		this.endcard_text_lower.angle = -28.6;
		this.endcard_text_lower.depth = 10;

    }

    update(time, delta) {
        console.log('setTimeStart: ' + this.setTimeStart);
        console.log('initTime: ' + this.initTime);
        console.log('Time: ' +time);
        if(this.initTime == 0){
        this.initTime = this.setInitTime(time);
        }
        console.log('initTime: ' + this.initTime);
        console.log('Time: ' +time);
        this.timer = (time / 1000) - this.initTime;

        this.timeText.setText(Math.round(this.timer));

        if (this.timer < this.gameDuration) {
            console.log('Time: ' +time);
            this.countDown(this.timer, this.title1);
            if (this.timer < 2) {
                this.player1.runAnimation(this.player1, `${this.player1.texture}-teleport`, 0, 0);
                this.player2.runAnimation(this.player2, `${this.player2.texture}-teleport`, 0, 0);
                console.log("a");
            }
            else if (this.timer > 2 && this.timer < 7) {
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
                this.powerup1.updatePowerup(this.player1, delta, this.grid);
                this.powerup2.updatePowerup(this.player1, delta, this.grid);
                this.powerup3.updatePowerup(this.player1, delta, this.grid);
                this.powerup1.updatePowerup(this.player2, delta, this.grid);
                this.powerup2.updatePowerup(this.player2, delta, this.grid);
                this.powerup3.updatePowerup(this.player2, delta, this.grid);
            }
        } 
		else if(!this.over)
		{
			this.over = true;
            this.finishGame();
        }
    }

    setInitTime(time){
        return time / 1000;
    }

    getPlayerColor(character) {
        switch (character) {
            case 'agata':
                return "0xFA27BA";

            case 'frank':
                return "0xFAD927";
        }

        return "0xFFFFFF";
    }

	toResults()
	{
		let scene = this.parent.scene;

		let ranking = scene.grid.countColors();
        scene.scene.start('Endgame', [ranking, scene.player1, scene.player2]); 
	}

    countDown(timer, title) {
        if (timer < 5) {
            this.uiTimer(title, 6, 'backwards');
        }
        else if (timer >= 6 && timer < 7) {
            title.setText('GO!');
            
        }
        else if (timer >= 7) {
            title.visible = false;
        }
    }

    uiTimer(title, start, run) {
        switch (run) {
            case 'forward':
                title.setText(` ${this.timer.toFixed(0)} `);
                break;
            case 'backwards':
                title.setText(` ${start - this.timer.toFixed(0)} `);
                break;
            default:
        }
    }

	// End sequence ------------------------------------
	finishGame() 
	{
		console.log("Game Over");
        this.add.tween({
			targets: this.endcard_upper,
			duration: 1000,
			x: 614,
			y: 280,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_text_upper,
			duration: 1000,
			x: 520.3,
			y: 303.3,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_lower,
			duration: 1000,
			x: 665.6,
			y: 374,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_text_lower,
			duration: 1000,
			x: 655.6,
			y: 355.9,
			ease: 'Cubic.inOut',
			onComplete: this.idleBars
		});
    }

	idleBars()
	{
		let scene = this.parent.scene;

		// Using a tween as a timer
		scene.add.tween({
			targets: scene.endcard_text_upper,
			duration: 1000,
			x: '+=0',
			onComplete: scene.removeBars
		});
	}

	removeBars()
	{	
		let scene = this.parent.scene;

		scene.add.tween({
			targets: scene.endcard_upper,
			duration: 1000,
			x: 2150,
			y: -557,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_text_upper,
			duration: 1000,
			x: 2056.3,
			y: -533.7,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_lower,
			duration: 1000,
			x: -871.8,
			y: 1211,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_text_lower,
			duration: 1000,
			x: -881.8,
			y: 1192.9,
			ease: 'Cubic.inOut',
			onComplete: scene.toResults
		});
	}
}

export default Game;
