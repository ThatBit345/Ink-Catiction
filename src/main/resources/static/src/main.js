import Menu from './menu.js';
import ChatRoom from './chatroom.js';
import Game from './game.js';
import Tutorial from './tutorial.js';
import Endgame from './endgame.js';
import LogReg from './logreg.js';
import Lobby from './lobby.js';
import OnlineGame from './onlinegame.js';
import Pause from './pause.js';

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
		disableContextMenu: true,
		fps: 60,
		pixelArt: true,
		physics: {
			default: "arcade",
			"arcade": {
				gravity: {
					y : 0
				}
			}
		},
		scene: [LogReg ,Menu, ChatRoom, Lobby, Game, OnlineGame, Endgame, Pause, Tutorial]
	}

	new Phaser.Game(config);
}

WebFont.load(fontConfig);