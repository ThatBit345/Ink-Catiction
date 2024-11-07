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
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create(data)
	{
		// Background assets
		this.splash = this.add.image(1000, 360, 'splash');
		this.background_slice = this.add.image(640, 360, 'back');

		// Main menu
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#000', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#000', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.ver = this.add.text(1130, 670, 'ver 0.01.00', {color: '#333', fontSize: '16px', fontFamily: 'Metamorphous'});
		this.play_button = new Button(this.onPlay, 'Play', this, 250, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		this.options_button = new Button(this.undefinedButton, 'Settings', this, 310, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		this.credits_button = new Button(this.onCredits, 'Credits', this, 370, 580, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		
		// Local/Online menu
		this.coms_title1 = this.add.text(680 - 1280, 80, 'Choose your', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.coms_title2 = this.add.text(730 - 1280, 150, 'connection type', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.local_button = new Button(this.onLocal, 'Local Play', this, 900 - 1280, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172);
		this.online_button = new Button(this.undefinedButton, 'Online Play', this, 820 - 1280, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172);
		this.online_button.toggleEnable();
		this.coms_back_button = new Button(this.onCommsBack, 'Back', this, 160 - 1280, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90);
		
		// Credits menu
		this.credits_back_button = new Button(this.onCreditsBack, 'Back', this, 160, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90);
		this.credits1 = this.add.text(680 + 1280, 180, 'Pablo Quiñones', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.credits2 = this.add.text(640 + 1280, 250, 'Sara Romero', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.credits3 = this.add.text(600 + 1280, 320, 'María Márquez', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.credits4 = this.add.text(560 + 1280, 390, 'Samuel Retamero', {color: '#000', fontSize: '48px', fontFamily: 'Metamorphous'});
		
		// Character Select menu
		this.char_back_button = new Button(this.onCharacterBack, 'Back', this, 160 - 2560, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90);
		

		// Elements to tween
		this.elements = [
			this.background_slice,
			this.title1,
			this.title2,
			this.ver,
			this.play_button, 
			this.options_button, 
			this.credits_button,
			this.coms_title1,
			this.coms_title2,
			this.local_button,
			this.online_button,
			this.coms_back_button,
			this.credits1,
			this.credits2,
			this.credits3,
			this.credits4,
			this.char_back_button
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

	// Comms Selection Functions -------------------------
	onLocal()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1100,
			x: '+=1280',
			ease: 'Cubic.inOut'
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
			targets: this.scene.elements,
			duration: 1000,
			x: '-=1280',
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