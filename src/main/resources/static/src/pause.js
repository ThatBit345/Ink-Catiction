import Button from './button.js';

class Pause extends Phaser.Scene {
    constructor() {
        super('Pause');
    }

    init(data) {
        
    }

    preload() {
		// Pause Menu Background frame
		this.load.image('marco', '../assets/ui/spr_frame_alt.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');

		this.load.image('panel', '../assets/ui/spr_button_normal.png');
		this.load.image('chat_icon', '../assets/ui/spr_chat_icon.png');

	 }
	create() { 
		
		// Pause menu configuration
		//this.pauseMenuBg = this.add.nineslice(640, 360, 'panel', undefined, 175, 110, 4, 4, 4, 4, undefined, undefined);
		this.pauseMenuBg = this.add.nineslice(640, 360, 'marco', undefined, 175, 110, 5, 5, 8, 6 , undefined, undefined);
		
		this.pauseMenuBg.depth = 4;
		this.pauseMenuBg.scale = 4;

		// Return to game
		this.resumeButton = new Button(this.onResume, 'Resume', '54px', this, 640, 240, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.resumeButton.depth = 5;

		//this.chatButton = new Button(this.onChat, '', '64px', this, 780, 300, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		//this.chatIcon = this.add.image(780, 300, 'chat_icon');
		//this.chatIcon.scale = 3;
		//this.chatButton.depth = 5;
		//this.chatIcon.depth = 5;

		// Return to main menu
		this.back_Menu_button = new Button(this.onBackToMenu, 'Menu', '54px', this, 640, 360, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.back_Menu_button.depth = 5;

		// Check tutorial
		//this.tutorial_Menu_Nutton= new Button(this.onTutorial, 'Tutorial', '54px', this, 640, 480, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		//this.tutorial_Menu_Nutton.depth = 5;
	}

	onResume() {
		this.scene.scene.resume("Game");
		this.scene.scene.sleep("Pause");
	}

	onBackToMenu() {
		this.scene.scene.stop("Game");
		this.scene.scene.start('Menu');
	}

	onTutorial() {
		//this.scene.scene.pause("Game");
		this.scene.scene.sleep("Pause");
		this.scene.scene.start('Tutorial');
	}
	
	onChat()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			y: '+=720',
			ease: 'Cubic.inOut',
			onComplete: this.scene.onChatFinish
		});
	}
}
export default Pause;
