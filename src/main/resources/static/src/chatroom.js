import Button from './button.js';
import TextEntry from './textentry.js'

let lastTimestamp = 0;
let messageLog;

class ChatRoom extends Phaser.Scene
{
	constructor()
	{
		super('ChatRoom');

		this.log = [];
		this.updateTimer = 0;
		this.updateCycleDuration = 500; // 0.5 second
	}

	init(data)
	{
		
	}

	preload()
	{
		this.load.image('background', '../assets/ui/spr_chatroom_back.png');
		this.load.image('black_fade', '../assets/ui/spr_black.png');

		this.load.image('user_icon', '../assets/ui/spr_chatroom_usericon.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create(data)
	{
		const textNormal = {color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textPlaceholder = {color: '#B87F27', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textDark = {color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textError = {color: '#A51818', fontSize: '32px', fontFamily: 'Metamorphous'};

		this.add.image(640, 360, 'background');

		// User counter
		this.add.image(100, 52, 'user_icon').scale = 3;
		this.userCounter = this.add.text(160, 40, '0', textNormal);
		
		// Chat panel
		this.logNslice = this.add.nineslice(640, 340, 'button_normal', undefined, 410, 160, 4, 4, 4, 4, undefined, undefined);
		this.logNslice.scale = 3;
		
		for (let index = 0; index < 11; index++) 
		{
			this.log[index] = this.add.text(40, 120 + 40 * index, '', textDark);
		}

		// Bottom bar
		//this.chatBar = this.add.nineslice(640, 650, 'button_normal', undefined, 230, 32, 4, 4, 4, 4, undefined, undefined);
		this.chatBar = new TextEntry(this, 640, 650, 260, 25, 'button_normal', 'button_highlighted', "Enter message...", textDark, textPlaceholder);

		this.sendButton = new Button(this.onSend, 'Send', '32px', this, 1160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 25);
		this.backButton = new Button(this.onBack, 'Back', '32px', this, 120, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 25);
	
		// Black fade
		this.blackFade = this.add.image(640, 360, 'black_fade');
		this.blackFade.setInteractive();
		this.blackFade.visible = false;
		this.blackFade.alpha = 0;

		// Connection error popup
		this.connectionErrorShown = false;
		this.connectionErrorPanel = this.add.nineslice(640, 360, 'button_normal', undefined, 300, 125, 4, 4, 4, 4, undefined, undefined);
		this.connectionErrorPanel.scale = 3;
		this.connectionErrorLabel = this.add.text(450, 200, 'An error has occurred!', textError);
		this.connectionErrorTextP1 = this.add.text(225, 250, 'There was a problem connecting to the server,', textDark);
		this.connectionErrorTextP2 = this.add.text(230, 300, 'connection will be reestablished automatically.', textDark);
		this.connectionErrorTextP3 = this.add.text(290, 350, 'Until then, online functions are disabled.', textDark);		
		this.connectionErrorButton = new Button(this.dismissError, 'Ok', '40px', this, 640, 470, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 24);

		this.connectionErrorPanel.visible = false;
		this.connectionErrorLabel.visible = false;
		this.connectionErrorTextP1.visible = false;
		this.connectionErrorTextP2.visible = false;
		this.connectionErrorTextP3.visible = false;
		this.connectionErrorButton.visible = false;

		this.input.on('pointerdown', function (pointer)
        {
			this.chatBar.checkForSelection();

        }, this);
		
		const user = this.registry.get('user');
		const baseUrl = '/api/chat/';
		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify({user:"System", message:"User [" + user + "] joined the chat!"}),
			dataType: 'json',
			processData: false,
			type: 'POST',
			url: baseUrl
		}).done(function(){

			scene.fetchMessages(scene);
		});
	}

	update(time, delta)
	{
		if(this.updateTimer <= this.updateCycleDuration) 
		{
			this.updateTimer += delta; 
			return;
		}

		this.updateTimer -= this.updateCycleDuration;

		this.fetchMessages(this);

		let userCounter = this.userCounter;
		const baseUrl = '/api/status/connected-users';
		let scene = this;

		$.get(baseUrl).done(function(data){
			userCounter.text = data.connectedUsers;
		}).fail(function(){
			scene.registry.set('connected', false);

			// Show the error prompt
			if(!scene.connectionErrorShown)
			{
				scene.connectionErrorShown = true;
	
				scene.blackFade.visible = true;
				scene.blackFade.alpha = 0.25;
					
				scene.connectionErrorPanel.visible = true;
				scene.connectionErrorLabel.visible = true;
				scene.connectionErrorTextP1.visible = true;
				scene.connectionErrorTextP2.visible = true;
				scene.connectionErrorTextP3.visible = true;
				scene.connectionErrorButton.visible = true;
			}

			// Clear chat log
			for (let index = 0; index < messageLog.length; index++) 
			{
				scene.log[index].text = "";
			}
		});
	}

	dismissError()
	{
		this.scene.scene.start('Menu');
	}

	onBack()
	{
		const user = this.scene.registry.get('user');
		const baseUrl = '/api/chat/';

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify({user:"System", message:"User [" + user + "] left the chat!"}),
			dataType: 'json',
			processData: false,
			type: 'POST',
			url: baseUrl
		});

		// Clear chat log
		for (let index = 0; index < messageLog.length; index++) 
		{
			scene.log[index].text = "";
		}

		this.scene.scene.start("Menu");
	}

	onSend()
	{
		let scene = this.scene;
		let user = this.scene.registry.get('user');
		let message = scene.chatBar.submitText();

		const baseUrl = '/api/chat/';
		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify({user:user, message:message}),
			dataType: 'json',
			processData: false,
			type: 'POST',
			url: baseUrl
		}).done(function(){

			scene.fetchMessages(scene);
		});
	}

	chatTest(scene)
	{
		const users = ["Bit", "Stanley", "Potato man", "Somebody", "Yes"];
		const messages = ["Hello!", "Bye!", "Door stuck!", "Patata subacuática en monopatín", "Banana rotate"];

		let user = users[Math.floor(Math.random() * users.length)];
		let message = messages[Math.floor(Math.random() * messages.length)];

		scene.postMessage(user, message);
		scene.fetchMessages(scene);
	}

	fetchMessages(scene)
	{
		const baseUrl = '/api/chat/' + lastTimestamp;
		$.get(baseUrl, function (data) {
			messageLog = data.messages;
		});

		scene.updateLog(scene);
	}

	updateLog(scene)
	{
		if (messageLog && messageLog.length > 0) 
		{
			for (let index = 0; index < messageLog.length; index++) 
			{
				scene.log[index].text = messageLog[index];
			}
		}
	}
}
export default ChatRoom;