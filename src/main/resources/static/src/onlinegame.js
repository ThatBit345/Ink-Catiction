import Player from "./player.js";
import OnlinePlayer from "./onlineplayer.js";
import Grid from "./grid.js";
import OnlinePowerup from "./onlinepowerup.js";
import Powerup from "./powerup.js";

class OnlineGame extends Phaser.Scene
{
	constructor()
	{
		super("OnlineGame");
	}

	init(data)
	{
		this.timer_dropped = false;
		this.timer = 1000000;
	}

	preload()
	{
		// Sound
		this.load.audio('bgm', '../assets/audio/mus_match.mp3');
		this.load.audio('end_whisle', '../assets/audio/snd_end.mp3');
		this.load.audio('bomb', '../assets/audio/snd_bomb.mp3');
		this.load.audio('powerup', '../assets/audio/snd_powerup.mp3');
		this.load.audio('hit', '../assets/audio/snd_hit.mp3');

		// UI
		this.load.image('endcard', '../assets/ui/spr_endcard_back.png');
		this.load.image('timer_back', '../assets/ui/spr_timer_back.png');
		this.load.image('panel', '../assets/ui/spr_button_normal.png');
		this.load.image('score_box', '../assets/ui/spr_button_normal.png');

		this.load.image('end_transition_left', '../assets/ui/spr_end_back_transition_left.png');
		this.load.image('end_transition_center', '../assets/ui/spr_end_back_transition_center.png');
		this.load.image('end_transition_right', '../assets/ui/spr_end_back_transition_right.png');
		this.load.image('end_back_fill', '../assets/ui/spr_end_back_fill.png');

        this.load.image('ink', '../assets/ink_10x.png');
		this.load.image('map', '../assets/map_catacombs.png');

        // Final Sprites
        this.load.spritesheet('agata', '../assets/spritesheets/sprsheet_agata.png', { frameWidth: 22, frameHeight: 22 });
        this.load.spritesheet('frank', '../assets/spritesheets/sprsheet_frankcatstein.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('gwynn', '../assets/spritesheets/sprsheet_gwynn.png', { frameWidth: 22, frameHeight: 22 });
        this.load.spritesheet('roach', '../assets/spritesheets/sprsheet_sardinilla.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('stregobor', '../assets/spritesheets/sprsheet_stregobor.png', { frameWidth: 22, frameHeight: 22 });
        this.load.spritesheet('yenna', '../assets/spritesheets/sprsheet_yenna.png', { frameWidth: 22, frameHeight: 22 });
		
		this.load.spritesheet('heart_agata', '../assets/spritesheets/spr_heart_agata.png', { frameWidth: 9, frameHeight: 9 });
        this.load.spritesheet('heart_frank', '../assets/spritesheets/spr_heart_frank.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_gwynn', '../assets/spritesheets/spr_heart_gwynn.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_roach', '../assets/spritesheets/spr_heart_roach.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_stregobor', '../assets/spritesheets/spr_heart_stregobor.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_yenna', '../assets/spritesheets/spr_heart_yenna.png', { frameWidth: 9, frameHeight: 9 });

		this.load.spritesheet('powerups', '../assets/spritesheets/powerups_spritesheet.png', { frameWidth: 16, frameHeight: 24 });
	}

	create()
	{
		this.playerId = this.registry.get('id');
		this.playerCharacter = this.registry.get('character');
		this.otherCharacter = this.registry.get('other_character');
		this.pos = this.registry.get('pos');
		this.otherPos = this.registry.get('other_pos');
		this.powerups = this.registry.get('powerups');

		console.log(this.playerId);
		console.log(this.playerCharacter);
		console.log(this.otherCharacter);
		console.log(this.pos);
		console.log(this.otherPos);
		console.log(this.powerups);

		this.socket = this.registry.get('socket');
		this.setupSocket();

		this.maxTime = 88;

        this.playerInk = this.getPlayerColor(this.playerCharacter);
        this.otherInk = this.getPlayerColor(this.otherCharacter);

		this.background = this.add.image(640, 360, 'map');
		this.background.depth = -10;

        // Local player Configuration
        this.keys1 = ["W", "A", "S", "D", "E"]
        this.velocity1 = 200;
        this.player = this.physics.add.existing(new Player(this, this.pos[0], this.pos[1], this.playerCharacter, 1, this.keys1, this.velocity1, this.playerInk));
        this.player.setCollideWorldBounds(true);

        // Other player Configuration
        this.other = this.physics.add.existing(new OnlinePlayer(this, this.otherPos[0], this.otherPos[1], this.otherCharacter, this.otherInk));
        this.other.setCollideWorldBounds(true);

		this.p1ScoreBox = this.add.image(85,50,'score_box');
		this.p1ScoreBox.scaleX = 5.0;
		this.p1ScoreBox.scaleY = 3.0;
		this.p1Score = this.add.text(20, 10, '0', { color: '#452600', fontSize: '64px', fontFamily: 'Metamorphous', align: 'center' });
		Phaser.Display.Align.In.Center(this.p1Score,this.p1ScoreBox);

		this.p2ScoreBox = this.add.image(1195,50,'score_box');
		this.p2ScoreBox.scaleX = 5.0;
		this.p2ScoreBox.scaleY = 3.0;
		this.p2Score = this.add.text(1187, 10, '0', { color: '#452600', fontSize: '64px', fontFamily: 'Metamorphous' , align: 'center'});
		Phaser.Display.Align.In.Center(this.p2Score,this.p2ScoreBox);

        // World Configuration
        this.grid = new Grid(this, 'ink', this.p1Score, this.p2Score);

		// Timer displays
		this.timer_back = this.add.image(640, -100, 'timer_back');
		this.timer_back.scale = 4;

		this.start_timer_back = this.add.nineslice(640, 360, 'panel', undefined, 64, 48, 4, 4, 4, 4, undefined, undefined)
		this.start_timer_back.scale = 4;
		this.start_timer_back.depth = 10;

		this.startTimeText = this.add.text(300, 50, ' ', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });
		this.startTimeText.depth = 10;

        this.timeText = this.add.text(0, 0, ' ', { color: '#452600', fontSize: '64px', fontFamily: 'Metamorphous' });
		this.timeText.depth = 10;
		Phaser.Display.Align.In.Center(this.timeText, this.timer_back);
        
		// End animation setup
		this.end_back_trans_left = this.add.image(213, 360 + 720, 'end_transition_left');
		this.end_back_trans_left.depth = 11;
		this.end_back_trans_center = this.add.image(426 + 213, -360, 'end_transition_center');
		this.end_back_trans_center.depth = 11;
		this.end_back_trans_right = this.add.image(852 + 213, 360 + 720, 'end_transition_right');
		this.end_back_trans_right.depth = 11;
		this.end_back_fill = this.add.image(640, 360, 'end_back_fill');
		this.end_back_fill.depth = 10;
		this.end_back_fill.alpha = 0;

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

		// PowerUps Configuration
		this.powerup1 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[0][0], this.powerups[0][1], 'powerups', this.powerups[0][2]));
		this.powerup2 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[1][0], this.powerups[1][1], 'powerups', this.powerups[1][2]));
		this.powerup3 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[2][0], this.powerups[2][2], 'powerups', this.powerups[2][2]));	
	}

	update(time, delta)
	{
		this.countDown(this.timer, this.startTimeText);
		Phaser.Display.Align.In.Center(this.startTimeText, this.start_timer_back);
			
		// Warmup period
		if (this.timer > this.maxTime - 1) 
		{
			this.player.runAnimation(this.player, `${this.player.texture}-teleport`, 0, 0);
			this.other.runAnimation(this.other, `${this.other.texture}-teleport`, 0, 0);
		}
		else if (this.timer <= this.maxTime - 1 && this.timer > this.maxTime - 7) 
		{
			this.player.runAnimation(this.player, `${this.player.texture}-idle`, 0, 0);
			this.other.runAnimation(this.other, `${this.other.texture}-idle`, 0, 0);
		}
		// Game period
		else 
		{
			if(!this.timer_dropped)
			{
				this.timer_dropped = true;
				this.start_timer_back.visible = false;
	
				this.add.tween({
					targets: this.timer_back,
					duration: 1000,
					y: 40,
					ease: 'Cubic.inOut'
				});
			}
	
			// Set display timer
			this.timeText.setText(this.timer);
			Phaser.Display.Align.In.Center(this.timeText, this.timer_back);
	
			//Update grid
			this.grid.updateGrid(this.player);
			this.grid.updateGrid(this.other);
	
			// Update both players basic movement
			this.player.updateMovement(this.player.velocity);
			this.other.calculateMovement();

			this.sendMessage('P', [this.player.sprite.x, this.player.sprite.y]);

			// Update the powerups
			var newPos = this.getRandomPosition();

			this.powerup1.updatePowerup(this.player, newPos[0],newPos[1], delta, this.grid);
			this.powerup2.updatePowerup(this.player, newPos[0],newPos[1], delta, this.grid);
			this.powerup3.updatePowerup(this.player, newPos[0],newPos[1], delta, this.grid);
	
			this.powerup1.updatePowerup(this.other, newPos[0],newPos[1], delta, this.grid);
			this.powerup2.updatePowerup(this.other, newPos[0],newPos[1], delta, this.grid);
			this.powerup3.updatePowerup(this.other, newPos[0],newPos[1], delta, this.grid);

			this.sendMessage('S', [this.powerup1.x, this.powerup1.y]);
			this.sendMessage('S', [this.powerup2.x, this.powerup2.y]);
			this.sendMessage('S', [this.powerup3.x, this.powerup3.y]);

			let scores = this.grid.countColors();
			let playerScoreBox = this.playerId == 1 ? this.p1Score : this.p2Score;
			let otherScoreBox = this.playerId == 1 ? this.p2Score : this.p1Score;

			playerScoreBox.setText(scores[0]);
			Phaser.Display.Align.In.Center(this.p1Score,this.p1ScoreBox);
	
			otherScoreBox.setText(scores[1]);
			Phaser.Display.Align.In.Center(this.p2Score,this.p2ScoreBox);
		}
	}

	// #region Timer display ---------------------------
	countDown(timer, title) {
        if (timer >= this.maxTime - 5) {
            title.setText(Math.abs(timer - this.maxTime + 5));
        }
        else if (timer < this.maxTime - 6 && timer >= this.maxTime - 7) {
            title.setText('GO!');
        }
        else if (timer < this.maxTime - 7) {
            title.visible = false;
        }
    }

	// #region Match end -------------------------------
	endSequence(data)
	{
		this.over = true;
			
		//this.bgm.stop();
		//this.endWhisle.play();
	
		// Remove timer element
		this.timeText.setText('');
		Phaser.Display.Align.In.Center(this.timeText, this.timer_back);
	
		this.add.tween({
			targets: this.timer_back,
			duration: 1000,
			y: -100,
			ease: 'Cubic.inOut'
		});
				
		// Reset players to idle state
		this.player.resetState();
		this.other.resetState();
	
		this.endData = data;

		this.finishGame();
	}

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
			onComplete: scene.backgroundSlide
		});
	}

	backgroundSlide()
	{
		let scene = this.parent.scene;

		scene.add.tween({
			targets: [scene.end_back_trans_left, scene.end_back_trans_center, scene.end_back_trans_right],
			duration: 1000,
			y: 360,
			ease: 'Cubic.inOut',
			onComplete: scene.fadeCatBackground
		});
	}

	fadeCatBackground()
	{
		let scene = this.parent.scene;

		scene.add.tween({
			targets: scene.end_back_fill,
			duration: 1000,
			alpha: 1,
			ease: 'Cubic.inOut',
			onComplete: scene.toResults
		});
	}

	toResults(data)
	{
		let scene = this.parent.scene;

		scene.socket.close();
		scene.registry.set('socket', undefined);

        scene.scene.start('Endgame', scene.endData); 
	}

	getRandomPosition()
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

	powerupSpawn(data) 
	{
		this.powerup1 = data[0];
		this.powerup2 = data[1];
		this.powerup3 = data[2];
	}

	// #region Network updates -------------------------
	updatePosition(data)
	{
		this.other.updatePosition(data);
	}

	handleTime(time)
	{
		this.timer = time;
	}

	// #region Communication ---------------------------
	setupSocket() {
		let scene = this;

		this.socket.onopen = () => {
			console.log("Socket opened!");
		}

		this.socket.onmessage = (event) => {

			const type = event.data.charAt(0);
			const data = event.data.length > 1 ? JSON.parse(event.data.substring(1)) : null;

			//console.log(`Recieved message with type [${type}]: ${data}`);

			switch (type) {
				case 'P':
					scene.updatePosition(data);
					break;
				
				case 'T':
					scene.handleTime(data);
					break;

				case 'F':
					scene.endSequence(data);
					break;
				case 'S':
					scene.powerupSpawn(data);
			}
		}

		this.sendMessage('G', null);
	}

	sendMessage(type, data) {
		if (this.socket.readyState === WebSocket.OPEN) {
			//console.log(data);
			if (data) {
				//console.log("Sent message!");
				this.socket.send(`${type}${JSON.stringify(data)}`);
			}
			else {
				//console.log("Sent empty message!");
				this.socket.send(type);
			}
		}
	}

	// #region Helper functions ------------------------
	getPlayerColor(character) {
        switch (character) {
            case 'agata':
                return "0xFA27BA";

            case 'frank':
                return "0xFAD927";

			case 'gwynn':
				return "0x27e8fa";
	
			case 'roach':
				return "0xff9d3b";

			case 'stregobor':
				return "0x2A42C9";
		
			case 'yenna':
				return "0x5d0aa6";
        }

        return "0xFFFFFF";
    }
}
export default OnlineGame;