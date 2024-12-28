import Button from './button.js';

class Endgame extends Phaser.Scene {
	constructor() {
		super('Endgame');
		this.ranking = [];
		this.players = [];
	}
  
	init(data) {
		this.ranking = data[0];
		this.players = [data[1],data[2]];
	}

	preload() {
		this.load.image('end_back', '../assets/ui/spr_end_back.png');
		this.load.image('banner_back', '../assets/ui/spr_endcard_back.png');

		this.load.image('agata_splash', '../assets/character_splash/agata_splash.png');
		this.load.image('frank_splash', '../assets/character_splash/frank_splash.png');
	}

	create(data) {
		this.end_background = this.add.image(640, 360, 'end_back');

		this.back_Menu_button = new Button(this.onBackToMenu, 'Menu', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);

		//this.title1 = this.add.text(245, 100, 'Game Ranking', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });

		let player1WinText = 'WINNER          PLAYER 1        WINNER          PLAYER 1        WINNER          PLAYER 1        WINNER';
		let player2WinText = 'WINNER          PLAYER 2        WINNER          PLAYER 2        WINNER          PLAYER 2        WINNER';
		let drawText = 'DRAW            DRAW            DRAW            DRAW            DRAW            DRAW            DRAW  ';

		//this.first = this.add.text(275, 250, 'First Place:', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		//this.second = this.add.text(275, 350, 'Second Place: ', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		//console.log('Muertes personaje1: ' +this.players[0].deaths+ ' Muertes personaje2: '+this.players[1].deaths);

		// Player 0 Win
		if (this.ranking[0] > this.ranking[1])
		{	
			this.splash = this.add.image(640, 360, this.players[0] + "_splash");
			this.splash.scale = 0.5;

			this.title = this.add.text(1280, 80, player1WinText, { color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous' });
			this.title.depth = 5;
			//this.first_name = this.add.text(675, 250, this.players[0].name +' ('+ this.ranking[0] +')', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			//this.second_name = this.add.text(675, 350, this.players[1].name +' ('+ this.ranking[1] +')', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		} 
		// Player 1 Win
		else if (this.ranking[0] < this.ranking[1])
		{
			this.splash = this.add.image(640, 360, this.players[1] + "_splash");
			this.splash.scale = 0.5;
			
			this.title = this.add.text(1280, 80, player2WinText, { color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous' });
			this.title.depth = 5;
			//this.first_name = this.add.text(675, 250, this.players[1].name  +' ('+ this.ranking[1] +')', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			//this.second_name = this.add.text(675, 350, this.players[0].name  +' ('+ this.ranking[0] +')', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		}
		// Draw
		else
		{
			this.title = this.add.text(1280, 80, drawText, { color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous' });
			this.title.depth = 5;
		}

		this.banner_back = this.add.image(2500, 100, 'banner_back');

		this.add.tween({
			targets: this.banner_back,
			duration: 1000,
			x: 300,
			ease: 'Cubic.inOut'
		});
	}

	update(time, delta)
	{
		this.title.x -= 0.5 * delta;
		if(this.title.x < -511) this.title.x -= -511;
	}

	onBackToMenu() {
		this.scene.scene.start('Menu', {});
	}
}
export default Endgame;
