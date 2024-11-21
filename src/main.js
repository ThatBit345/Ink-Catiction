import Menu from './menu.js';

var fontConfig = {

	active: function()
	{
		startGame();
	},

	google:{
		// Fonts to be imported
		families: ['Metamorphous']
	}
}

var startGame = function(){
	const config = {
		title: "Ink Catiction",
		type: Phaser.AUTO,
		width: 1280,
		height: 720,
		autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
		pixelArt: true,
		physics: {
			default: "arcade",
			"arcade": {
				gravity: {
					y : 0
				}
			}
		},
		scene: Menu
	}

	new Phaser.Game(config);
}

WebFont.load(fontConfig);