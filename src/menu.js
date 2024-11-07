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
		this.background_slice = this.add.image(0, 360, 'back');

		// Main menu
		this.title1 = this.add.text(50, 20, 'Ink', {color: '#000', fontSize: '96px'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#000', fontSize: '96px'});
		this.ver = this.add.text(1130, 670, 'ver 0.01.00', {color: '#333', fontSize: '16px'});
		this.play_button = new Button(this.onPlay, 'Play', this, 250, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		this.options_button = new Button(this.undefinedButton, 'Settings', this, 310, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		this.credits_button = new Button(this.undefinedButton, 'Credits', this, 370, 580, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128);
		
		// Local/Online menu
		this.coms_title1 = this.add.text(680 - 1280, 80, 'Choose your', {color: '#000', fontSize: '48px'});
		this.coms_title2 = this.add.text(730 - 1280, 150, 'connection type', {color: '#000', fontSize: '48px'});
		this.local_button = new Button(this.undefinedButton, 'Local Play', this, 900 - 1280, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172);
		this.online_button = new Button(this.undefinedButton, 'Online Play', this, 820 - 1280, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172);
		this.online_button.toggleEnable();
		this.coms_back_button = new Button(this.onCommsBack, 'Back', this, 160 - 1280, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90);

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
			this.coms_back_button
		]
	}

	update(time, delta)
	{
		
	}

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

	undefinedButton()
	{
		console.log("Pressed button");
	}

}

export default Menu;