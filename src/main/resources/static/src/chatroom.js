import Button from './button.js';

let lastTimestamp = 0;
let messageLog;

class ChatRoom extends Phaser.Scene {
	constructor() {
		super('ChatRoom');

		this.log = [];
		this.inText;
		this.updateTimer = 0;
		this.updateCycleDuration = 1000; // 1 second
	}

	init(data) {
	}

	preload() {
		this.load.image('background', '../assets/ui/spr_chatroom_back.png');

		this.load.image('user_icon', '../assets/ui/spr_chatroom_usericon.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create(data) {
		const textNormal = { color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous' };
		const textDark = { color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous' };

		this.add.image(640, 360, 'background');

		// User counter
		this.add.image(100, 52, 'user_icon').scale = 3;
		this.userCounter = this.add.text(160, 40, '0', textNormal);

		// Chat panel
		this.logNslice = this.add.nineslice(640, 340, 'button_normal', undefined, 410, 160, 4, 4, 4, 4, undefined, undefined);
		this.logNslice.scale = 3;

		for (let index = 0; index < 11; index++) {
			this.log[index] = this.add.text(40, 120 + 40 * index, '', textDark);
		}

		// Bottom bar
		this.chatBar = this.add.nineslice(640, 650, 'button_normal', undefined, 230, 32, 4, 4, 4, 4, undefined, undefined);
		this.chatBar.scale = 3;

		this.inText = this.add.text(310, 630, '', textDark);
		
		//Phaser.Display.Align.In.Center(this.inText, this.chatBar);
		
		this.sendButton = new Button(this.onSend, 'Send', '64px', this, 1120, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.backButton = new Button(this.onBack, 'Back', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
	
	}

	update(time, delta) {
		this.updateTimer += delta;
		if (this.updateTimer > this.updateCycleDuration) {
			console.log("Updated log");
			this.updateTimer -= this.updateCycleDuration;
			this.fetchMessages(this);
		}
	}

	onBack() {
		this.scene.scene.start("Menu");
	}

	onSend() {
		this.scene.chatText(this.scene);
	}

	chatTest(scene) {
		const users = ["Bit", "Stanley", "Potato man", "Somebody", "Yes"];
		const messages = ["Hello!", "Bye!", "Door stuck!", "Patata subacuática en monopatín", "Banana rotate"];

		let user = users[Math.floor(Math.random() * users.length)];
		let message = messages[Math.floor(Math.random() * messages.length)];

		scene.postMessage(user, message);
		scene.fetchMessages(scene);
	}

	chatText(scene) {
		const users = ["Bit", "Stanley", "Potato man", "Somebody", "Yes"];
		this.getMessage();

		let user = users[Math.floor(Math.random() * users.length)];
		let message = this.inText.text;
		scene.postMessage(user, message);
		scene.fetchMessages(scene);
		this.inText.text = '';
	}

	getMessage() {
		this.input.keyboard.on('keydown', e => {
			if (e.keyCode === 8 && this.inText.text.length > 0) {
				this.inText.text = this.inText.text.substr(0, this.inText.text.length - 1);
			}
			else if (e.keyCode === 32 || (e.keyCode >= 48 && e.keyCode <= 90)) {
				this.inText.text += e.key;
			}
		});
	}

	postMessage(user, message) {
		const baseUrl = `${window.location.origin}/api/chat`;
		$.post(baseUrl, { user: user, message: message });
	}

	fetchMessages(scene) {
		const baseUrl = `${window.location.origin}/api/chat`;
		$.get(baseUrl, { since: lastTimestamp }, function (data) {
			messageLog = data.messages;
		});

		scene.updateLog(scene);
	}

	updateLog(scene) {
		if (messageLog && messageLog.length > 0) {
			for (let index = 0; index < messageLog.length; index++) {
				scene.log[index].text = messageLog[index];
			}
		}
	}
}
export default ChatRoom;