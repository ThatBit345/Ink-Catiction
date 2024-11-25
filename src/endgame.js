import Button from './button.js';

class Endgame extends Phaser.Scene {
	constructor() {
		super('Endgame');
	}
  
	init(data) {
		this.p1score = data[0];
		this.p2score = data[1];
		//console.log(ranking);
		var Players = [data[2],data[3]];
		console.log(Players);
		console.log('Ranking de la partida: ' + this.p1score + 'vs' + this.p2score);
	}

	preload() {
		this.load.image('end_back', '../assets/ui/spr_menu_background.png');
	}

	create(data) {
		this.end_background = this.add.image(640, 360, 'end_back');

		this.back_button = new Button(this.onCommsBack, 'Back', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);

		this.title1 = this.add.text(245, 100, 'Game Ranking', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });

		//this.first = this.add.text(250, 250, 'First Place: ' + 'player1', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		//this.second = this.add.text(250, 350, 'Second Place: ' + 'player2', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });


		console.log('Ranking de la partida: ' + this.p1score + 'vs' + this.p2score);
		if (this.p1score > this.p2score) {
			//this.first_name = this.add.text(350, 250, this.Players[1].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			//this.second_name = this.add.text(350, 350, this.Players[0].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.first = this.add.text(250, 250, 'First Place: ' + 'player1', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second = this.add.text(250, 350, 'Second Place: ' + 'player2', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.p1Text = this.add.text(250, 450, 'Player1 score: ' + this.p1score, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.p2Text = this.add.text(250, 550, 'Player1 score: ' + this.p2score, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		} else if (this.p1score < this.p2score) {
			//this.first_name = this.add.text(350, 250, 'player2', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			//this.second_name = this.add.text(350, 350, 'player1', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.first = this.add.text(250, 250, 'First Place: ' + 'player2', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second = this.add.text(250, 350, 'Second Place: ' + 'player1', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		}

	}

	onCommsBack() {
		//this.scene.start('Menu',0); 
	}
}
export default Endgame;
