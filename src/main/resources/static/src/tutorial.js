import Button from './button.js';

class Tutorial extends Phaser.Scene
{
	constructor()
	{
		super('Tutorial');
	}

	init(data)
	{

	}

	preload()
	{
		this.load.image('background', '../assets/ui/spr_chatroom_back.png');
		this.load.image('keys1', '../assets/ui/keys_player1.png');
		this.load.image('keys2', '../assets/ui/keys_player2.png');
	

		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create() {
		const textNormal = {color: '#452600', fontSize: '50px', fontFamily: 'Metamorphous'};
		const textTitle = {color: '#E5B770', fontSize: '64px', fontFamily: 'Metamorphous'};

		this.add.image(640, 360, 'background');
		this.keysP1 = this.add.image(850,250,'keys1');
		this.keysP1.scale = 3;
		this.keysP2 = this.add.image(850,500,'keys2');
		this.keysP2.scale = 3;
		this.backButton = new Button(this.onBack, 'Back', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.player1Text = this.add.text(60,200, "Player 1", textTitle);
		this.player2Text = this.add.text(60,460, "Player 2", textTitle);
		this.movementText = this.add.text(620, 40, "Movement", textNormal);
		this.attackText = this.add.text(960, 40, "Attack", textNormal);

	}

	update(time,delta){

	}

	onBack() {
		this.scene.scene.start('Menu');
	}
}

export default Tutorial;