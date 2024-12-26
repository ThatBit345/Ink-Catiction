import Button from './button.js';

class Lobby extends Phaser.Scene {
	constructor() {
		super('Lobby');
	}

	init(data) {

	}

	preload() {
		// Background elements
		this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('wait', '../assets/ui/spr_end_back.png');
		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');
		this.load.image('card', '../assets/ui/spr_endcard_back.png');

		// Character icons
		this.load.image('agata_icon', '../assets/character_icons/icon_agata.png');
		this.load.image('frank_icon', '../assets/character_icons/icon_frank.png');
		this.load.image('gwynn_icon', '../assets/character_icons/icon_gwynn.png');
		this.load.image('roach_icon', '../assets/character_icons/icon_roach.png');
		this.load.image('stregobor_icon', '../assets/character_icons/icon_stregobor.png');
		this.load.image('yenna_icon', '../assets/character_icons/icon_yenna.png');
		this.load.image('lock_icon', '../assets/character_icons/icon_locked.png');

		// Character splash
		this.load.image('agata_splash', '../assets/character_splash/agata_splash.png');
		this.load.image('frank_splash', '../assets/character_splash/frank_splash.png');
		this.load.image('gwynn_splash', '../assets/character_splash/gwynn_splash.png');
		this.load.image('roach_splash', '../assets/character_splash/roach_splash.png');
		this.load.image('stregobor_splash', '../assets/character_splash/stregobor_splash.png');
		this.load.image('yenna_splash', '../assets/character_splash/yenna_splash.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');

		// Misc
		this.load.image('black_fade', '../assets/ui/spr_black.png');
		this.load.image('throbber', '../assets/ui/spr_throbber.png');
	}

	create(data) {
		const textTitle = { color: '#E5B770', fontSize: '48px', fontFamily: 'Metamorphous' };
		const textTitleDark = { color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous' };
		const textNormal = { color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous' };
		const textDark = { color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous' };

		this.character = undefined;
		this.otherCharacter = undefined;

		// Black fade ----------------------------------
		this.blackFade = this.add.image(640, 360, 'black_fade');
		this.blackFade.setInteractive();
		this.blackFade.depth = 10;
		this.blackFade.visible = false;
		this.blackFade.alpha = 0;

		// Wait screen ---------------------------------
		this.waitElements = [
			this.lobbyWait = this.add.image(640, 360, 'wait'),
			this.throbber = this.add.image(640, 300, 'throbber'),
			this.throbber_shadow = this.add.image(644, 304, 'throbber'),
			this.lobbyTextBack = this.add.image(640, 200, 'card'),
			this.lobbyText = this.add.text(0, 0, "Waiting for another player...", textDark)
		]

		this.throbber.scale = 3;
		this.throbber.depth = 10;

		this.throbber_shadow.scale = 3;
		this.throbber_shadow.depth = 9;
		this.throbber_shadow.setTint("0x301100");

		this.throbber_rotation = 0;

		this.lobbyWait.depth = 8;
		this.lobbyTextBack.depth = 8;
		this.lobbyText.depth = 8;
		Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyTextBack);

		// Character Select menu -----------------------
		this.background = this.add.image(640, 360, 'wait');
		this.charBackLeft = this.add.image(640, -620, 'back_char_left');
		this.charBackRight = this.add.image(640, 1340, 'back_char_right');
		this.charTitleBack = this.add.nineslice(640, 100, 'button_normal', undefined, 130, 50, 4, 4, 4, 4, undefined, undefined)
		this.charTitleBack.scale = 3;
		this.charTitle1 = this.add.text(460, 40, 'Choose your', { color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous' });
		this.charTitle2 = this.add.text(560, 110, 'character', { color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous' });
		this.charBackButton = new Button(this.onBack, 'Back', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);

		// Agata
		this.char1Button = new Button(() => {this.onSelectCharacter("agata");}, ' ', '64px', this, 520, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char1Icon = this.add.image(520, 525, 'agata_icon');
		this.char1Icon.scale = 3;
		
		// Frank
		this.char2Button = new Button(() => {this.onSelectCharacter("frank");}, ' ', '64px', this, 640, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char2Icon = this.add.image(640, 525, 'frank_icon');
		this.char2Icon.scale = 3;

		// Gwynn
		this.char3Button = new Button(() => {this.onSelectCharacter("gwynn");}, ' ', '64px', this, 760, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char3Icon = this.add.image(760, 525, 'gwynn_icon');
		this.char3Icon.scale = 3;

		// Roach
		this.char4Button = new Button(() => {this.onSelectCharacter("roach");}, ' ', '64px', this, 520, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char4Icon = this.add.image(520, 645, 'roach_icon');
		this.char4Icon.scale = 3;

		// Stregobor
		this.char5Button = new Button(() => {this.onSelectCharacter("stregobor");}, ' ', '64px', this, 640, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char5Icon = this.add.image(640, 645, 'stregobor_icon');
		this.char5Icon.scale = 3;

		// Yenna
		this.char6Button = new Button(() => {this.onSelectCharacter("yenna");}, ' ', '64px', this, 760, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char6Icon = this.add.image(760, 645, 'yenna_icon');
		this.char6Icon.scale = 3;

		// Character splash art
		this.player1SplashBack = this.add.nineslice(-200, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player1SplashBack.scale = 3;
		this.player1SplashBack.visible = false;

		this.player1Splash = this.add.image(-200, 325, 'agata_splash');
		this.player1Splash.scale = 0.25;
		this.player1Splash.visible = false;

		this.player1SplashNameplate = this.add.text(-200, 100, 'NAME', textTitleDark);
		this.player1SplashNameplate.visible = false;

		this.player2SplashBack = this.add.nineslice(1480, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player2SplashBack.scale = 3;
		this.player2SplashBack.visible = false;

		this.player2Splash = this.add.image(1480, 325, 'frank_splash');
		this.player2Splash.scale = 0.25;
		this.player2Splash.flipX = true;
		this.player2Splash.visible = false;

		this.player2SplashNameplate = this.add.text(1480, 100, 'NAME', textTitleDark);
		this.player2SplashNameplate.visible = false;

		this.readyButton = new Button(this.onReady, 'Ready!', '40px', this, 640, 425, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 24);
		this.readyButton.disable();

		this.socket = new WebSocket("ws://" + location.host + "/ws");
		this.registry.set('socket', this.socket);
		this.setupSocket();
	}

	update(time, delta) {
		this.throbber_rotation += 0.005 * delta;
		if (this.throbber_rotation > 2 * 3.1415) this.throbber_rotation -= 2 * 3.1415;

		this.throbber.setRotation(this.throbber_rotation);
		this.throbber_shadow.setRotation(this.throbber_rotation);
	}

	onBack()
	{
		this.scene.socket.close();
		this.scene.scene.start("Menu");
	}

	startLobby() 
	{
		this.tweens.chain({
			targets: null,
			tweens: [
				{
					targets: this.waitElements,
					duration: 1000,
					y: '-=720',
					ease: 'Cubic.inOut'
				},
				{
					targets: [this.charBackLeft, this.charBackRight],
					duration: 300,
					y: 360,
					ease: 'Cubic.inOut'
				}
			],
			delay: 0
		});
	}

	onReady()
	{
		this.scene.readyButton.disable();
		this.scene.sendMessage('Y', this.scene.character);
	}

	onSelectCharacter(character)
	{
		if (this.character != undefined) 
		{
			// Tween the character splash screen in and out of view
			this.tweens.chain({
				targets: null,
				tweens: [
					{
						targets: [this.player1Splash, this.player1SplashBack, this.player1SplashNameplate],
						duration: 1000,
						x: '-=400',
						ease: 'Cubic.inOut',
						onComplete: () => { this.setPanel(character); }
					},
					{
						targets: [this.player1Splash, this.player1SplashBack, this.player1SplashNameplate],
						duration: 1000,
						x: '+=400',
						ease: 'Cubic.inOut'
					}
				],
				delay: 0
			});
		}
		else {
			// Set the character splash screen
			this.player1SplashBack.visible = true;
			this.player1Splash.visible = true;
			this.player1SplashNameplate.visible = true;

			this.player1Splash.setTexture(`${character}_splash`);

			let name = character.charAt(0).toUpperCase();
			name += character.slice(1);
			this.player1SplashNameplate.text = name;
			Phaser.Display.Align.In.Center(this.player1SplashNameplate, this.player1SplashBack);
			this.player1SplashNameplate.y = 50;

			this.add.tween({
				targets: [this.player1Splash, this.player1SplashBack, this.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}

		this.character = character;

		switch (character) {
			case "agata":
				this.char1Button.disable();
				this.char2Button.enable();
				break;

			case "frank":
				this.char1Button.enable();
				this.char2Button.disable();
				break;
		}
		
		this.readyButton.enable();
		this.toggleButtons();
	}

	setPanel(character)
	{
		// Set the character splash screen
		this.player1SplashBack.visible = true;
		this.player1Splash.visible = true;
		this.player1SplashNameplate.visible = true;

		this.player1Splash.setTexture(`${character}_splash`);

		let name = character.charAt(0).toUpperCase();
		name += character.slice(1);
		this.player1SplashNameplate.text = name;
		Phaser.Display.Align.In.Center(this.player1SplashNameplate, this.player1SplashBack);
		this.player1SplashNameplate.y = 50;
	}

	onOtherSelect(character) {
		// Tween the character splash screen into view
		if (this.otherCharacter != undefined) {
			this.tweens.chain({
				targets: null,
				tweens: [
					{
						targets: [this.player2Splash, this.player2SplashBack, this.player2SplashNameplate],
						duration: 1000,
						x: '+=400',
						ease: 'Cubic.inOut',
						onComplete: () => { this.setOtherPanel(character); }
					},
					{
						targets: [this.player2Splash, this.player2SplashBack, this.player2SplashNameplate],
						duration: 1000,
						x: '-=400',
						ease: 'Cubic.inOut'
					}
				],
				delay: 0
			});
		}
		else {
			// Set the character splash screen
			this.player2SplashBack.visible = true;
			this.player2Splash.visible = true;
			this.player2SplashNameplate.visible = true;

			this.player2Splash.setTexture(`${character}_splash`);

			let name = character.charAt(0).toUpperCase();
			name += character.slice(1);
			this.player2SplashNameplate.text = name;
			Phaser.Display.Align.In.Center(this.player2SplashNameplate, this.player2SplashBack);
			this.player2SplashNameplate.y = 50;

			this.add.tween({
				targets: [this.player2Splash, this.player2SplashBack, this.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
		}

		this.otherCharacter = character;

		if(character == this.character) 
			this.readyButton.disable();
		
		this.toggleButtons()
	}

	setOtherPanel(character) {
		console.log(this);

		// Set the character splash screen
		this.player2SplashBack.visible = true;
		this.player2Splash.visible = true;
		this.player2SplashNameplate.visible = true;

		this.player2Splash.setTexture(`${character}_splash`);

		let name = character.charAt(0).toUpperCase();
		name += character.slice(1);
		this.player2SplashNameplate.text = name;
		Phaser.Display.Align.In.Center(this.player2SplashNameplate, this.player2SplashBack);
		this.player2SplashNameplate.y = 50;
	}

	toggleButtons()
	{
		// This is spaguetti incarnate
		if(this.character == "agata" || this.otherCharacter == "agata") this.char1Button.disable();
		else this.char1Button.enable();
		
		if(this.character == "frank" || this.otherCharacter == "frank") this.char2Button.disable();
		else this.char2Button.enable();

		if(this.character == "gwynn" || this.otherCharacter == "gwynn") this.char3Button.disable();
		else this.char3Button.enable();
		
		if(this.character == "roach" || this.otherCharacter == "roach") this.char4Button.disable();
		else this.char4Button.enable();

		if(this.character == "stregobor" || this.otherCharacter == "stregobor") this.char5Button.disable();
		else this.char5Button.enable();
		
		if(this.character == "yenna" || this.otherCharacter == "yenna") this.char6Button.disable();
		else this.char6Button.enable();
	}

	toGame(data)
	{
		this.registry.set('id', data.id);
		this.registry.set('character', data.character);
		this.registry.set('pos', data.pos);
		this.registry.set('other_character', data.other_character);
		this.registry.set('other_pos', data.other_pos);
		this.registry.set('powerups', data.powerups);

		this.scene.start('OnlineGame');
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

			console.log(`Recieved message with type [${type}]: ${data}`);

			switch (type) {
				case 'L':
					scene.scene.start("Menu");
					break;

				case 'I':
					scene.startLobby();
					break;

				case 'Y':
					if (data == "no") return;
					else this.onOtherSelect(data);
					break;

				case 'G':
					scene.toGame(data);
					break;
			}
		}
	}

	sendMessage(type, data) {
		if (this.socket.readyState === WebSocket.OPEN) {
			console.log(data);
			if (data) {
				console.log("Sent message!");
				this.socket.send(`${type}${JSON.stringify(data)}`);
			}
			else {
				console.log("Sent empty message!");
				this.socket.send(type);
			}
		}
	}
}

export default Lobby;
