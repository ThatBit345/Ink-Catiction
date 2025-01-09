import Player from "./player.js";
import OnlinePlayer from "./onlineplayer.js";
import Grid from "./grid.js";
import OnlinePowerup from "./onlinepowerup.js";

class OnlineGame extends Phaser.Scene {
	constructor() {
		super("OnlineGame");
	}

	init(data) {
		this.timer_dropped = false;
		this.timer = 1000000;
	}

	preload() {
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
		this.load.image('score_box2', '../assets/ui/spr_tile_count.png');

		this.load.image('end_transition_left', '../assets/ui/spr_end_back_transition_left.png');
		this.load.image('end_transition_center', '../assets/ui/spr_end_back_transition_center.png');
		this.load.image('end_transition_right', '../assets/ui/spr_end_back_transition_right.png');
		this.load.image('end_back_fill', '../assets/ui/spr_end_back_fill.png');

		this.load.image('ink', '../assets/ink_10x.png');

		// Maps
		this.load.image('catacomb_map', '../assets/map_catacombs_base.png');
		this.load.image('catacomb_map_extra', '../assets/map_catacombs_extras.png');
		this.load.image('forest_map', '../assets/map_forest_base.png');
		this.load.image('forest_map_extra', '../assets/map_forest_extras.png');

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

	create() {
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

		// Map config
		this.bg;
		this.bg_extras;
		this.setMap();

		// Local player Configuration
		this.keys1 = ["W", "A", "S", "D", "E"]
		this.velocity1 = 200;
		this.player = this.physics.add.existing(new Player(this, this.pos[0], this.pos[1], this.playerCharacter, this.playerId, this.keys1, this.velocity1, this.playerInk));
		this.player.setCollideWorldBounds(true);
		this.player.networked = true;

		// Other player Configuration
		this.other = this.physics.add.existing(new OnlinePlayer(this, this.otherPos[0], this.otherPos[1], this.playerId, this.otherCharacter, this.otherInk));
		this.other.setCollideWorldBounds(true);

		this.p1ScoreBox = this.add.image(85, 50, 'score_box2');
		this.p1ScoreBox.scaleX = 4.0;
		this.p1ScoreBox.scaleY = 3.0;
		this.p1Score = this.add.text(20, 10, '0', { color: '#E5B770', fontSize: '42px', fontFamily: 'Metamorphous', align: 'center' });
		Phaser.Display.Align.In.Center(this.p1Score, this.p1ScoreBox);

		this.p2ScoreBox = this.add.image(1195, 50, 'score_box2');
		this.p2ScoreBox.scaleX = 4.0;
		this.p2ScoreBox.scaleY = 3.0;
		this.p2Score = this.add.text(1187, 10, '0', { color: '#E5B770', fontSize: '42px', fontFamily: 'Metamorphous', align: 'center' });
		Phaser.Display.Align.In.Center(this.p2Score, this.p2ScoreBox);

		// World Configuration
		this.grid = new Grid(this, 'ink', this.p1Score, this.p2Score);

		// PowerUps Configuration
		this.powerup1 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[0][0], this.powerups[0][1], 'powerups', this.powerups[0][2]));
		this.powerup2 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[1][0], this.powerups[1][1], 'powerups', this.powerups[1][2]));
		this.powerup3 = this.physics.add.existing(new OnlinePowerup(this, this.powerups[2][0], this.powerups[2][1], 'powerups', this.powerups[2][2]));

		// Timer displays
		this.timer_back = this.add.image(640, -100, 'timer_back');
		this.timer_back.scale = 4;
		this.timer_back.depth = 9;

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

		// Audio
		let vol = this.registry.get('volume');
		this.sound.setVolume(vol);

		this.bgm = this.sound.add('bgm');
		this.bgm.play();

		this.endWhisle = this.sound.add('end_whisle');
	}

	update(time, delta) {
		this.countDown(this.timer, this.startTimeText);
		Phaser.Display.Align.In.Center(this.startTimeText, this.start_timer_back);

		// Warmup period
		if (this.timer > this.maxTime - 1) {
			this.player.runAnimation(this.player, `${this.player.texture}-teleport`, 0, 0);
			this.other.runAnimation(this.other, `${this.other.texture}-teleport`, 0, 0);
		}
		else if (this.timer <= this.maxTime - 1 && this.timer > this.maxTime - 7) {
			this.player.runAnimation(this.player, `${this.player.texture}-idle`, 0, 0);
			this.other.runAnimation(this.other, `${this.other.texture}-idle`, 0, 0);
		}
		// Game period
		else {
			if (!this.timer_dropped) {
				this.timer_dropped = true;
				this.start_timer_back.visible = false;

				this.add.tween({
					targets: this.timer_back,
					duration: 1000,
					y: 40,
					ease: 'Cubic.inOut'
				});

				console.log(this.powerup3);
			}

			// Set display timer
			this.timeText.setText(this.timer);
			Phaser.Display.Align.In.Center(this.timeText, this.timer_back);

			//Update grid
			this.grid.updateGrid(this.player);
			this.grid.updateGrid(this.other);

			// Update both players basic movement
			if (!this.player.dead) this.player.updateMovement(this.player.velocity);
			if (!this.other.dead) this.other.calculateMovement();

			// Check if player hit the other player
			this.player.checkNetworkCollission(this.other, delta);

			// Send server information
			this.sendMessage('P', [this.player.sprite.x, this.player.sprite.y]);
			this.powerupCollection();

			// Update powerups
			if(this.powerup1.sprite.visible) this.powerup1.updatePowerup();
			if(this.powerup2.sprite.visible) this.powerup2.updatePowerup();
			if(this.powerup3.sprite.visible) this.powerup3.updatePowerup();

			let scores = this.grid.countColors();

			this.p1Score.setText(scores[0]);
			Phaser.Display.Align.In.Center(this.p1Score, this.p1ScoreBox);

			this.p2Score.setText(scores[1]);
			Phaser.Display.Align.In.Center(this.p2Score, this.p2ScoreBox);
		}
	}

	// #region Map generation --------------------------
	setMap() {
		this.randBg = 1;
		switch (this.randBg) {
			case 1:
				// Scary Catacombs
				this.bg = this.add.image(640, 360, 'catacomb_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'catacomb_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 1;
				break;
			case 2:
				// Fantasy forest
				this.bg = this.add.image(640, 360, 'forest_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'forest_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 3;
				this.bg_extras.alpha = 0.5;
				break;
			case 3:
				// Placeholder for third map -> Victory Stadium
				this.bg = this.add.image(640, 360, 'forest_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'forest_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 3;
				this.bg_extras.alpha = 0.5;
				break;
			default: console.log("unable to create map!");

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
	endSequence(data) {
		this.over = true;

		this.bgm.stop();
		this.endWhisle.play();

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

	finishGame() {
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

	idleBars() {
		let scene = this.parent.scene;

		// Using a tween as a timer
		scene.add.tween({
			targets: scene.endcard_text_upper,
			duration: 1000,
			x: '+=0',
			onComplete: scene.removeBars
		});
	}

	removeBars() {
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

	backgroundSlide() {
		let scene = this.parent.scene;

		scene.add.tween({
			targets: [scene.end_back_trans_left, scene.end_back_trans_center, scene.end_back_trans_right],
			duration: 1000,
			y: 360,
			ease: 'Cubic.inOut',
			onComplete: scene.fadeCatBackground
		});
	}

	fadeCatBackground() {
		let scene = this.parent.scene;

		scene.add.tween({
			targets: scene.end_back_fill,
			duration: 1000,
			alpha: 1,
			ease: 'Cubic.inOut',
			onComplete: scene.toResults
		});
	}

	toResults(data) {
		let scene = this.parent.scene;

		scene.socket.close();
		scene.registry.set('socket', undefined);

		scene.scene.start('Endgame', scene.endData);
	}

	getRandomPosition() {
		let x, y;

		x = (Math.random() * (31 - 1) + 1) * 40;
		y = (Math.random() * (17 - 1) + 1) * 40;

		// Clamp values to the map's range
		if (x < 100) x = 100;
		else if (x > 1180) x = 1180;

		if (y < 180) y = 180;
		else if (y > 680) y = 680;

		return [x, y];
	}

	powerupSpawn(data) {
		if (!this.powerup1.sprite.visible) { this.powerup1.respawn(data); }
		if (!this.powerup2.sprite.visible) { this.powerup2.respawn(data); }
		if (!this.powerup3.sprite.visible) { this.powerup3.respawn(data); }
	}

	powerupCollection() {
		let distance = 40;

		if (this.manhattanDistance(this.powerup1.x, this.powerup1.y, this.player.sprite.x, this.player.sprite.y) < distance) {
			this.sendMessage('C', null);
		}
		else if (this.manhattanDistance(this.powerup2.x, this.powerup2.y, this.player.sprite.x, this.player.sprite.y) < distance) {
			this.sendMessage('C', null);
		}
		else if (this.manhattanDistance(this.powerup3.x, this.powerup3.y, this.player.sprite.x, this.player.sprite.y) < distance) {
			this.sendMessage('C', null);
		}
	}

	// #region Network updates -------------------------
	updatePosition(data) {
		this.other.updatePosition(data);
	}

	handleTime(time) {
		this.timer = time;
	}

	handleDeath(num) {
		if (num == this.playerId) {
			console.log("Local player death");
			this.player.networkDeath();
		}
		else {
			console.log("Other player death");
			this.other.deathSequence();
		}
	}

	handlePowerup(data) 
	{
		let posX = data[0];
		let posY = data[1];
		let num = data[2];
		let player = (num == this.playerId) ? this.player : this.other;

		if(this.powerup1.x == posX && this.powerup1.y == posY) 
		{
			console.log("Player " + num + " grabbed powerup of type " + this.powerup1.type);
			this.powerup1.applyPowerup(player, this.grid);
		}
		else if(this.powerup2.x == posX && this.powerup2.y == posY) 
		{
			console.log("Player " + num + " grabbed powerup of type " + this.powerup2.type);
			this.powerup2.applyPowerup(player, this.grid);
		}
		else if(this.powerup3.x == posX && this.powerup3.y == posY) 
		{
			console.log("Player " + num + " grabbed powerup of type " + this.powerup3.type);
			this.powerup3.applyPowerup(player, this.grid);
		}
	}

	handlePowerupDepletion(num)
	{
		if(num == this.playerId)
		{
			this.player.velocity = 200;
			this.player.power = false;
		}
		else
		{
			this.other.velocity = 200;
			this.other.powerup = false;
		}
	}

	handleRespawn(num) {
		if (num == this.playerId) {
			console.log("Local player respawn");
			this.player.networkRespawn();
		}
		else {
			console.log("Other player respawn");
			this.other.respawn();
		}
	}

	// #region Communication ---------------------------
	setupSocket() {
		let scene = this;

		this.socket.onopen = () => {
			console.log("Socket opened!");
		}

		this.socket.onerror = () => {
			console.log("SOCKET DEAD");
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
					break;

				case 'A':
					scene.other.attack(scene.player);
					break;

				case 'D':
					scene.handleDeath(data);
					break;

				case 'R':
					scene.handleRespawn(data);
					break;

				case 'C':
					scene.handlePowerup(data);
					break;

				case 'O':
					scene.handlePowerupDepletion(data);
					break;
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

	manhattanDistance(powerx, powery, playerx, playery){
        return Math.abs(powerx - playerx) + Math.abs(powery - playery);
    }
}
export default OnlineGame;