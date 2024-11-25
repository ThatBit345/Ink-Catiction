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
		this.load.image('end_back', '../assets/ui/spr_menu_background.png');
	}

	create(data) {
		this.end_background = this.add.image(640, 360, 'end_back');

		this.back_Menu_button = new Button(this.onBackToMenu, 'Menu', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);

		this.title1 = this.add.text(245, 100, 'Game Ranking', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });

		this.first = this.add.text(350, 250, 'First Place:', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		this.second = this.add.text(350, 350, 'Second Place: ', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		console.log('Muertes personaje1: ' +this.players[0].deaths+ ' Muertes personaje2: '+this.players[1].deaths);

		if (this.ranking[0] > this.ranking[1] || (this.ranking[0] == this.ranking[1] && this.players[0].deaths < this.players[1].deaths)) {	
			this.first_name = this.add.text(700, 250, this.players[0].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second_name = this.add.text(700, 350, this.players[1].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		} else if (this.ranking[0] < this.ranking[1] || (this.ranking[0] == this.ranking[1] && this.players[0].deaths > this.players[1].deaths)) {
			this.first_name = this.add.text(700, 250, this.players[1].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second_name = this.add.text(700, 350, this.players[0].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		}
	}

	onBackToMenu() {
		this.scene.scene.start('Menu', {});
	}
}
export default Endgame;
