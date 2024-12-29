import Button from './button.js';

class Pause extends Phaser.Scene {
    constructor() {
        super('Pause');
    }

    init(data) {
        
    }

    preload() {
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
		this.pauseMenuBg = this.add.nineslice(640, 360, 'panel', undefined, 175, 110, 4, 4, 4, 4, undefined, undefined);
		this.pauseMenuBg.depth = 4;
		this.pauseMenuBg.scale = 4;

		// Pause menu configuration
		this.resumeButton = new Button(this.onResume, 'Resume', '64px', this, 640, 300, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.resumeButton.depth = 5;

		//this.chatButton = new Button(this.onChat, '', '64px', this, 780, 300, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		//this.chatIcon = this.add.image(780, 300, 'chat_icon');
		//this.chatIcon.scale = 3;
		//this.chatButton.depth = 5;
		//this.chatIcon.depth = 5;

		this.back_Menu_button = new Button(this.onBackToMenu, 'Menu', '64px', this, 640, 420, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.back_Menu_button.depth = 5;
	}

	onResume() {
		this.scene.scene.resume("Game");
		this.scene.scene.sleep("Pause");
	}

	onBackToMenu() {
		this.scene.scene.stop("Game");
		this.scene.scene.start('Menu');
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
