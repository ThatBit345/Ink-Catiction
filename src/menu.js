import Button from './button.js';

class Menu extends Phaser.Scene
{
	constructor()
	{
		super('Menu');
	}

	init(data)
	{
		this.player1 = undefined;
		this.player2 = undefined;
	}

	preload()
	{
		// Background UI
		this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');

		// Character icons
		this.load.image('agata_icon', '../assets/character_icons/icon_agata.png');
		this.load.image('frank_icon', '../assets/character_icons/icon_frank.png');
		this.load.image('lock_icon', '../assets/character_icons/icon_locked.png');

		// Character splash
		this.load.image('agata_splash', '../assets/character_splash/agata_splash.png');
		this.load.image('frank_splash', '../assets/character_splash/frank_splash.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create(data)
	{
		const text_title = {color: '#E5B770', fontSize: '48px', fontFamily: 'Metamorphous'};
		const text_normal = {color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous'};
		const text_title_dark = {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'};

		// Background assets
		this.splash = this.add.image(1000, 360, 'splash');
		this.background_slice = this.add.image(640, 1080, 'back');

		// Main menu -----------------------------------
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.ver = this.add.text(1130, 670, 'ver 0.01.00', {color: '#333', fontSize: '16px', fontFamily: 'Metamorphous'});
		this.play_button = new Button(this.onPlay, 'Play', '64px', this, 250, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.options_button = new Button(this.onSettings, 'Settings', '64px', this, 310, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.credits_button = new Button(this.onCredits, 'Credits', '64px', this, 370, 580, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		
		// Local/Online menu ---------------------------
		this.coms_title1 = this.add.text(680 - 1280, 80, 'Choose your', text_title);
		this.coms_title2 = this.add.text(730 - 1280, 150, 'connection type', text_title);
		this.local_button = new Button(this.onLocal, 'Local Play', '64px', this, 900 - 1280, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		this.online_button = new Button(this.undefinedButton, 'Online Play', '64px', this, 820 - 1280, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		this.online_button.toggleEnable();
		this.coms_back_button = new Button(this.onCommsBack, 'Back', '64px', this, 160 - 1280, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		// Credits menu --------------------------------
		this.credits_back_button = new Button(this.onCreditsBack, 'Back', '64px', this, 160, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.credits_title = this.add.text(720 + 1280, 80, 'Credits', text_title);
		this.credits1 = this.add.text(680 + 1280, 180, 'Pablo Quiñones', text_normal);
		this.credits2 = this.add.text(640 + 1280, 250, 'Sara Romero', text_normal);
		this.credits3 = this.add.text(600 + 1280, 320, 'María Márquez', text_normal);
		this.credits4 = this.add.text(560 + 1280, 390, 'Samuel Retamero', text_normal);
		
		// Settings menu -------------------------------
		this.settings_back_button = new Button(this.onSettingsBack, 'Back', '64px', this, 160, 1440 + 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.settings_title = this.add.text(60, 1440 + 60, 'Settings', text_title);
		this.volume_label = this.add.text(160, 1440 + 160, 'Volume', text_title);
		this.volume_text = this.add.text(260, 1440 + 240, '10', text_normal);
		this.volume_down_button = new Button(this.onMasterDecrease, '-', '40px', this, 200, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);
		this.volume_up_button = new Button(this.onMasterIncrease, '+', '40px', this, 360, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);

		// Character Select menu -----------------------
		this.char_back_left = this.add.image(640, -620, 'back_char_left');
		this.char_back_right = this.add.image(640, 1340, 'back_char_right');
		this.char_title1 = this.add.text(460 - 2560, 40, 'Choose your', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.char_title2 = this.add.text(560 - 2560, 110, 'miauracter', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.char_back_button = new Button(this.onCharacterBack, 'Back', '64px', this, 160 - 2560, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		// Agata
		this.char1_button = new Button(this.onSelectAgata, ' ', '64px', this, 520 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char1_icon = this.add.image(520 - 2560, 525, 'agata_icon');
		this.char1_icon.scale = 3;
		
		// Frank
		this.char2_button = new Button(this.onSelectFrank, ' ', '64px', this, 640 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char2_icon = this.add.image(640 - 2560, 525, 'frank_icon');
		this.char2_icon.scale = 3;

		// Empty
		this.char3_button = new Button(this.onSelectCharacter, ' ', '64px', this, 760 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char3_button.toggleEnable();
		this.char3_icon = this.add.image(760 - 2560, 525, 'lock_icon');
		this.char3_icon.scale = 3;

		// Empty
		this.char4_button = new Button(this.onSelectCharacter, ' ', '64px', this, 520 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char4_button.toggleEnable();
		this.char4_icon = this.add.image(520 - 2560, 645, 'lock_icon');
		this.char4_icon.scale = 3;

		// Empty
		this.char5_button = new Button(this.onSelectCharacter, ' ', '64px', this, 640 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char5_button.toggleEnable();
		this.char5_icon = this.add.image(640 - 2560, 645, 'lock_icon');
		this.char5_icon.scale = 3;

		// Empty
		this.char6_button = new Button(this.onSelectCharacter, ' ', '64px', this, 760 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char6_button.toggleEnable();
		this.char6_icon = this.add.image(760 - 2560, 645, 'lock_icon');
		this.char6_icon.scale = 3;

		// Character splash art
		this.player1_splash_back = this.add.nineslice(-200 - 2560, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player1_splash_back.scale = 3;
		this.player1_splash_back.visible = false;

		this.player1_splash = this.add.image(-200 - 2560, 325, 'agata_splash');
		this.player1_splash.scale = 0.25;
		this.player1_splash.visible = false;

		this.player1_splash_nameplate = this.add.text(-200 - 2560, 100, 'NAME', text_title_dark);
		this.player1_splash_nameplate.visible = false;

		this.player2_splash_back = this.add.nineslice(1480 - 2560, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player2_splash_back.scale = 3;
		this.player2_splash_back.visible = false;

		this.player2_splash = this.add.image(1480 - 2560, 325, 'frank_splash');
		this.player2_splash.scale = 0.25;
		this.player2_splash.flipX = true;
		this.player2_splash.visible = false;

		this.player2_splash_nameplate = this.add.text(1480 - 2560, 100, 'NAME', text_title_dark);
		this.player2_splash_nameplate.visible = false;

		this.start_game_button = new Button(this.onStartGame, 'Start!', '40px', this, 640 - 2560, 425, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 24);
		this.start_game_button.toggleEnable();

		// Elements to tween ---------------------------
		this.elements = [
			this.background_slice,
			this.title1,
			this.title2,
			this.ver,
			this.play_button, 
			this.options_button, 
			this.credits_button,
			this.settings_back_button,
			this.settings_title,
			this.volume_label,
			this.volume_text,
			this.volume_down_button,
			this.volume_up_button,
			this.coms_title1,
			this.coms_title2,
			this.local_button,
			this.online_button,
			this.coms_back_button,
			this.credits_title,
			this.credits1,
			this.credits2,
			this.credits3,
			this.credits4,
			this.char_back_button,
			this.char_title1,
			this.char_title2,
			this.char1_button,
			this.char2_button,
			this.char3_button,
			this.char4_button,
			this.char5_button,
			this.char6_button,
			this.char1_icon,
			this.char2_icon,
			this.char3_icon,
			this.char4_icon,
			this.char5_icon,
			this.char6_icon,
			this.player1_splash_back,
			this.player2_splash_back,
			this.player1_splash,
			this.player2_splash,
			this.player1_splash_nameplate,
			this.player2_splash_nameplate,
			this.start_game_button
		]
	}

	update(time, delta)
	{
		
	}

	// Main Menu Functions -----------------------------
	onPlay()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '+=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=740',
			ease: 'Cubic.inOut'
		});
	}

	onSettings()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			y: '-=1440',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=380',
			ease: 'Cubic.inOut'
		});
	}

	onCredits()
	{
		this.scene.tweens.chain({
			targets: null,
			tweens: [
				{
					targets: this.scene.elements,
					duration: 1000,
					x: '-=1280',
					ease: 'Cubic.inOut'
				},
				{
					targets: this.scene.credits_back_button,
					duration: 400,
					y: '-=200',
					ease: 'Cubic.out'
				},
			],
			delay: 0
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=740',
			ease: 'Cubic.inOut'
		});
	}

	// Settings Functions ------------------------------
	onSettingsBack()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			y: '+=1440',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=380',
			ease: 'Cubic.inOut'
		});
	}

	onMasterIncrease()
	{
		let volume = this.scene.sound.volume;
		volume += 0.1;
		// Clamp volume
		if(volume > 1) volume = 1;
		else if(volume < 0) volume = 0;

		this.scene.sound.setVolume(volume);
		this.scene.volume_text.text = Math.round(volume * 10);
	}

	onMasterDecrease()
	{
		let volume = this.scene.sound.volume;
		volume -= 0.1;
		// Clamp volume
		if(volume > 1) volume = 1;
		else if(volume < 0) volume = 0;

		this.scene.sound.setVolume(volume);
		this.scene.volume_text.text = Math.round(volume * 10);
	}

	// Comms Selection Functions -----------------------
	onLocal()
	{
		this.scene.tweens.chain({
			targets: null,
			tweens: [
				{
					targets: this.scene.elements,
					duration: 1000,
					x: '+=1280',
					ease: 'Cubic.inOut'
				},
				{
					targets: [this.scene.char_back_left, this.scene.char_back_right],
					duration: 300,
					y: 360,
					ease: 'Cubic.inOut'
				},
				{
					targets: this.scene.char_back_button,
					duration: 400,
					y: '-=200',
					ease: 'Cubic.out'
				}
			],
			delay: 0
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 800,
			x: '+=380',
			ease: 'Cubic.inOut'
		});
	}

	onCommsBack()
	{

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '-=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=740',
			ease: 'Cubic.inOut'
		});
	}

	// Character Functions -----------------------------
	onSelectCharacter()
	{
		this.scene.scene.start('Game');
	}

	onSelectAgata()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'agata';
			console.log("Set player 1 to Agata");

			// Set the character splash screen
			this.scene.player1_splash_back.visible = true;
			this.scene.player1_splash.visible = true;
			this.scene.player1_splash_nameplate.visible = true;

			this.scene.player1_splash.setTexture('agata_splash');
			this.scene.player1_splash_nameplate.text = "Agata";
			Phaser.Display.Align.In.Center(this.scene.player1_splash_nameplate, this.scene.player1_splash_back);
			this.scene.player1_splash_nameplate.y = 50;

			this.scene.char1_button.toggleEnable();

			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1_splash, this.scene.player1_splash_back, this.scene.player1_splash_nameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'agata';
			console.log("Set player 2 to Agata");

			// Set the character splash screen
			this.scene.player2_splash_back.visible = true;
			this.scene.player2_splash.visible = true;
			this.scene.player2_splash_nameplate.visible = true;

			this.scene.player2_splash.setTexture('agata_splash');
			this.scene.player2_splash_nameplate.text = "Agata";
			Phaser.Display.Align.In.Center(this.scene.player2_splash_nameplate, this.scene.player2_splash_back);
			this.scene.player2_splash_nameplate.y = 50;

			this.scene.char1_button.toggleEnable();

			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2_splash, this.scene.player2_splash_back, this.scene.player2_splash_nameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.start_game_button.toggleEnable();
		}
	}

	onSelectFrank()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'frank';
			console.log("Set player 1 to Frank");

			// Set the character splash screen
			this.scene.player1_splash_back.visible = true;
			this.scene.player1_splash.visible = true;
			this.scene.player1_splash_nameplate.visible = true;

			this.scene.player1_splash.setTexture('frank_splash');
			this.scene.player1_splash_nameplate.text = "Frank";
			Phaser.Display.Align.In.Center(this.scene.player1_splash_nameplate, this.scene.player1_splash_back);
			this.scene.player1_splash_nameplate.y = 50;

			this.scene.char2_button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1_splash, this.scene.player1_splash_back, this.scene.player1_splash_nameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'frank';
			console.log("Set player 2 to Frank");

			// Set the character splash screen
			this.scene.player2_splash_back.visible = true;
			this.scene.player2_splash.visible = true;
			this.scene.player2_splash_nameplate.visible = true;
			
			this.scene.player2_splash.setTexture('frank_splash');
			this.scene.player2_splash_nameplate.text = "Frank";
			Phaser.Display.Align.In.Center(this.scene.player2_splash_nameplate, this.scene.player2_splash_back);
			this.scene.player2_splash_nameplate.y = 50;

			this.scene.char2_button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2_splash, this.scene.player2_splash_back, this.scene.player2_splash_nameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.start_game_button.toggleEnable();
		}
	}

	onStartGame()
	{
		this.scene.scene.start('Game', {player1: this.scene.player1, player2: this.scene.player2});
	}

	onCharacterBack()
	{
		this.scene.add.tween({
			targets: this.scene.char_back_button,
			duration: 400,
			y: '+=200',
			ease: 'Cubic.out'
		});

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '-=1280',
			ease: 'Cubic.inOut',
			onComplete: this.scene.characterBackCallback
		});

		this.scene.add.tween({
			targets: this.scene.char_back_left,
			duration: 400,
			y: -620,
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.char_back_right,
			duration: 400,
			y: 1340,
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=380',
			ease: 'Cubic.inOut'
		});
	}

	characterBackCallback(tween, targets)
	{
		let scene = this.parent.scene;

		// Reset the character splash art screens
		scene.player1_splash_back.visible = false;
		scene.player1_splash.visible = false;
		scene.player1_splash_nameplate.visible = false;

		scene.player1_splash_back.x = -200 - 1280;
		scene.player1_splash.x = -200 - 1280;
		scene.player1_splash_nameplate.x = -200 - 1280;

		scene.player2_splash_back.visible = false;
		scene.player2_splash.visible = false;
		scene.player2_splash_nameplate.visible = false;

		scene.player2_splash_back.x = 1480 - 1280;
		scene.player2_splash.x = 1480 - 1280;
		scene.player2_splash_nameplate.x = 1480 - 1280;

		if(scene.start_game_button.enabled) scene.start_game_button.toggleEnable();

		// Reset the character buttons and selection
		if(!scene.char1_button.enabled) scene.char1_button.toggleEnable();
		if(!scene.char2_button.enabled) scene.char2_button.toggleEnable();

		scene.player1 = undefined;
		scene.player2 = undefined;
	}

	// Credits Functions -------------------------------
	onCreditsBack()
	{
		this.scene.add.tween({
			targets: this.scene.credits_back_button,
			duration: 400,
			y: '+=200',
			ease: 'Cubic.out'
		});

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '+=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=740',
			ease: 'Cubic.inOut'
		});
	}
	
	undefinedButton()
	{
		console.log("Undefined button");
	}

}

export default Menu;