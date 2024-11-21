import Button from './button.js';

class Menu extends Phaser.Scene
{
	constructor()
	{
		super('Menu');
	}

	init(data)
	{
		
	}

	preload()
	{
		this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');

		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create(data)
	{
		const text_title = {color: '#E5B770', fontSize: '48px', fontFamily: 'Metamorphous'};
		const text_normal = {color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous'};

		// Background assets
		this.splash = this.add.image(1000, 360, 'splash');
		this.background_slice = this.add.image(640, 1080, 'back');

		// Main menu
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.ver = this.add.text(1130, 670, 'ver 0.01.00', {color: '#333', fontSize: '16px', fontFamily: 'Metamorphous'});
		this.play_button = new Button(this.onPlay, 'Play', this, 250, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.options_button = new Button(this.onSettings, 'Settings', this, 310, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.credits_button = new Button(this.onCredits, 'Credits', this, 370, 580, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		
		// Local/Online menu
		this.coms_title1 = this.add.text(680 - 1280, 80, 'Choose your', text_title);
		this.coms_title2 = this.add.text(730 - 1280, 150, 'connection type', text_title);
		this.local_button = new Button(this.onLocal, 'Local Play', this, 900 - 1280, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		this.online_button = new Button(this.undefinedButton, 'Online Play', this, 820 - 1280, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		this.online_button.toggleEnable();
		this.coms_back_button = new Button(this.onCommsBack, 'Back', this, 160 - 1280, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		// Credits menu
		this.credits_back_button = new Button(this.onCreditsBack, 'Back', this, 160, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.credits_title = this.add.text(720 + 1280, 80, 'Credits', text_title);
		this.credits1 = this.add.text(680 + 1280, 180, 'Pablo Quiñones', text_normal);
		this.credits2 = this.add.text(640 + 1280, 250, 'Sara Romero', text_normal);
		this.credits3 = this.add.text(600 + 1280, 320, 'María Márquez', text_normal);
		this.credits4 = this.add.text(560 + 1280, 390, 'Samuel Retamero', text_normal);
		
		// Settings menu
		this.settings_back_button = new Button(this.onSettingsBack, 'Back', this, 160, 1440 + 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.settings_title = this.add.text(60, 1440 + 60, 'Settings', text_title);
		this.volume_label = this.add.text(160, 1440 + 160, 'Volume', text_title);
		this.volume_text = this.add.text(260, 1440 + 240, '10', text_normal);
		this.volume_down_button = new Button(this.onMasterDecrease, '-', this, 200, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);
		this.volume_up_button = new Button(this.onMasterIncrease, '+', this, 360, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);

		// Character Select menu
		this.char_back_left = this.add.image(640, -620, 'back_char_left');
		this.char_back_right = this.add.image(640, 1340, 'back_char_right');
		this.char_title1 = this.add.text(460 - 2560, 40, 'Choose your', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.char_title2 = this.add.text(560 - 2560, 110, 'miauracter', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.char_back_button = new Button(this.onCharacterBack, 'Back', this, 160 - 2560, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		this.char1_button = new Button(this.undefinedButton, ' ', this, 520 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char2_button = new Button(this.undefinedButton, ' ', this, 640 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char3_button = new Button(this.undefinedButton, ' ', this, 760 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char4_button = new Button(this.undefinedButton, ' ', this, 520 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char5_button = new Button(this.undefinedButton, ' ', this, 640 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char6_button = new Button(this.undefinedButton, ' ', this, 760 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);

		// Elements to tween
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
			this.char6_button
		]
	}

	update(time, delta)
	{
		
	}

	// Main Menu Functions -------------------------
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

	// Settings Functions --------------------------------
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

	// Comms Selection Functions -------------------------
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

	// Character Functions -------------------------
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
			ease: 'Cubic.inOut'
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

	// Credits Functions -------------------------
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
		console.log("Pressed button");
	}

}

export default Menu;