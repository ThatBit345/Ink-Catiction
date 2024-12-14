import Button from './button.js';

class LogReg extends Phaser.Scene
{
	constructor()
	{
		super('LogReg');
	}

	preload()
	{
		// Background UI
		this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');

		// Character splash
		this.load.image('agata_splash', '../assets/character_splash/agata_splash.png');
		this.load.image('frank_splash', '../assets/character_splash/frank_splash.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create() {
		console.log(this);
		this.registry.set('volume', 1);

		// Background assets
		this.splash = this.add.image(1000, 360, 'splash');
		this.backgroundSlice = this.add.image(640, 1080-360, 'back');

		// Game Title -----------------------------------
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.ver = this.add.text(800, 670, 'ver 0.1.0', {color: '#452600', fontSize: '16px', fontFamily: 'Metamorphous'});

		this.logInButton = new Button(this.onLogIn, 'Log in', '32px', this, 140, 270, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 20);
		this.logInButton.toggleEnable();

		this.usernameText = this.add.text(50, 315, 'Username:', {color: '#E5B770', fontSize: '20px', fontFamily: 'Metamorphous'});
		this.usernameBox = this.add.nineslice(50, 350, 'button_normal', undefined, 140, 25, 4, 4, 4, 4, undefined, undefined).setOrigin(0,0);
		this.usernameBox.scale = 3;

		this.passwordText = this.add.text(50, 435, 'Password:', {color: '#E5B770', fontSize: '20px', fontFamily: 'Metamorphous'});
		this.passwordBox = this.add.nineslice(50, 470, 'button_normal', undefined, 140, 25, 4, 4, 4, 4, undefined, undefined).setOrigin(0,0);
		this.passwordBox.scale = 3;

		this.registerButton = new Button(this.onRegister, 'Register', '32px', this, 380, 270, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 20);
	}

	onRegister() {
		this.scene.registerButton.toggleEnable();
		this.scene.logInButton.toggleEnable();
	}

	onLogIn() {
		this.scene.registerButton.toggleEnable();
		this.scene.logInButton.toggleEnable();
	}
}
export default LogReg;