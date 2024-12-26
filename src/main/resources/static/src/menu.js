import Button from './button.js';
import TextEntry from './textentry.js';

class Menu extends Phaser.Scene
{
	constructor()
	{
		super('Menu');
	}

	init(data)
	{
		this.player1 = undefined;
		this.player2 = undefined;
	}

	preload()
	{
		// Background UI
		this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');

		// Character icons
		this.load.image('agata_icon', '../assets/character_icons/icon_agata.png');
		this.load.image('frank_icon', '../assets/character_icons/icon_frank.png');
		this.load.image('gwynn_icon', '../assets/character_icons/icon_gwynn.png');
		this.load.image('roach_icon', '../assets/character_icons/icon_roach.png');
		this.load.image('stregobor_icon', '../assets/character_icons/icon_stregobor.png');
		this.load.image('yenna_icon', '../assets/character_icons/icon_yenna.png');
		this.load.image('lock_icon', '../assets/character_icons/icon_locked.png');

		// Character splash
		this.load.image('agata_splash', '../assets/character_splash/agata_splash.png');
		this.load.image('frank_splash', '../assets/character_splash/frank_splash.png');
		this.load.image('gwynn_splash', '../assets/character_splash/gwynn_splash.png');
		this.load.image('roach_splash', '../assets/character_splash/roach_splash.png');
		this.load.image('stregobor_splash', '../assets/character_splash/stregobor_splash.png');
		this.load.image('yenna_splash', '../assets/character_splash/yenna_splash.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');

		// Misc
		this.load.image('chat_icon', '../assets/ui/spr_chat_icon.png');
		this.load.image('black_fade', '../assets/ui/spr_black.png');
		this.load.image('throbber', '../assets/ui/spr_throbber.png');

		this.load.image('status_connected', '../assets/ui/spr_status_connected.png');
		this.load.image('status_disconnected', '../assets/ui/spr_status_disconnected.png');
	}

	create(data)
	{
		this.sound.setVolume(this.registry.get('volume'));

		const textTitle = {color: '#E5B770', fontSize: '48px', fontFamily: 'Metamorphous'};
		const textNormal = {color: '#E5B770', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textDark = {color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textError = {color: '#A51818', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textTitleDark = {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'};
		const inputTextNormal = {color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous'};
		const inputTextPlaceholder = {color: '#B87F27', fontSize: '32px', fontFamily: 'Metamorphous'};
		
		this.online = this.registry.get('online');

		// Background assets
		this.splash = this.add.image(1000, 360, 'splash');
		this.backgroundSlice = this.add.image(640, 1080-360, 'back');

		// Main menu -----------------------------------
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.ver = this.add.text(50, 660, 'ver 0.1.0', {color: '#E5B770', fontSize: '24px', fontFamily: 'Metamorphous'});
		this.playButton = new Button(this.onPlay, 'Play', '64px', this, 250, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.optionsButton = new Button(this.onSettings, 'Settings', '64px', this, 310, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		this.creditsButton = new Button(this.onCredits, 'Credits', '64px', this, 370, 580, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 128, 32);
		
		this.chatButton = new Button(this.onChat, '', '64px', this, 500, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.chatIcon = this.add.image(500, 340, 'chat_icon');
		this.chatIcon.scale = 3;

		// Local/Online menu ---------------------------
		this.comsTitle1 = this.add.text(680 - 1280, 80, 'Choose your', textTitle);
		this.comsTitle2 = this.add.text(730 - 1280, 150, 'connection type', textTitle);
		this.localButton = new Button(this.onLocal, 'Local Play', '64px', this, 900 - 1280, 340, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		this.onlineButton = new Button(this.onOnline, 'Online Play', '64px', this, 820 - 1280, 460, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 172, 32);
		//this.onlineButton.toggleEnable();
		this.comsBackButton = new Button(this.onCommsBack, 'Back', '64px', this, 160 - 1280, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		// Credits menu --------------------------------
		this.creditsBackButton = new Button(this.onCreditsBack, 'Back', '64px', this, 160, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.creditsTitle = this.add.text(720 + 1280, 80, 'Credits', textTitle);
		this.credits1 = this.add.text(680 + 1280, 180, 'Pablo Quiñones', textNormal);
		this.credits2 = this.add.text(640 + 1280, 250, 'Sara Romero', textNormal);
		this.credits3 = this.add.text(600 + 1280, 320, 'María Márquez', textNormal);
		this.credits4 = this.add.text(560 + 1280, 390, 'Samuel Retamero', textNormal);
		
		// Settings menu -------------------------------
		this.settingsBackButton = new Button(this.onSettingsBack, 'Back', '64px', this, 160, 1440 + 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		this.settingsTitle = this.add.text(60, 1440 + 60, 'Settings', textTitle);
		this.volumeLabel = this.add.text(160, 1440 + 160, 'Volume', textTitle);
		this.volumeText = this.add.text(260, 1440 + 240, Math.round(this.registry.get('volume') * 10), textNormal);
		this.volumeDownButton = new Button(this.onMasterDecrease, '-', '40px', this, 200, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);
		this.volumeUpButton = new Button(this.onMasterIncrease, '+', '40px', this, 360, 1440 + 260, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 16, 16);
		
		this.changePasswordLabel = this.add.text(160, 1440 + 300, 'Account', textTitle);
		this.changePasswordBox = new TextEntry(this, 400, 1440 + 400, 160, 25, 'button_normal', 'button_highlighted', "New password...", inputTextNormal, inputTextPlaceholder);
		this.changePasswordButton = new Button(this.onChangePassword, 'Change', '40px', this, 740, 1440 + 400, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 25);
		this.changePasswordConfirm = this.add.text(840, 1440 + 380, 'Changed', textNormal);
		this.changePasswordConfirm.visible = false;
		
		this.deleteAccountButton = new Button(this.onDeleteAccount, 'Delete account', '40px', this, 400, 1440 + 500, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 160, 25);
		this.deleteAccountConfirm = this.add.text(650, 1440 + 450, 'Are you sure?', textNormal);
		this.deleteAccountConfirmButton = new Button(this.onDeleteConfirm, 'Yes', '40px', this, 700, 1440 + 520, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 20);
		this.deleteAccountDenyButton = new Button(this.onDeleteDeny, 'No', '40px', this, 840, 1440 + 520, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 20);
		this.deleteAccountConfirm.visible = false;
		this.deleteAccountConfirmButton.visible = false;
		this.deleteAccountDenyButton.visible = false;
		
		// Throbber
		this.throbber = this.add.image(880, 1440 + 400, 'throbber');
		this.throbber.scale = 3;
		this.throbber.depth = 10;
		this.throbber.visible = false;

		this.throbber_shadow = this.add.image(884, 1440 + 404, 'throbber');
		this.throbber_shadow.scale = 3;
		this.throbber_shadow.depth = 9;
		this.throbber_shadow.setTint("0x301100");
		this.throbber_shadow.visible = false;

		this.throbber_rotation = 0;

		// Character Select menu -----------------------
		this.charBackLeft = this.add.image(640, -620, 'back_char_left');
		this.charBackRight = this.add.image(640, 1340, 'back_char_right');
		this.charTitleBack = this.add.nineslice(640 - 2560, 100, 'button_normal', undefined, 130, 50, 4, 4, 4, 4, undefined, undefined)
		this.charTitleBack.scale = 3;
		this.charTitle1 = this.add.text(460 - 2560, 40, 'Choose your', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.charTitle2 = this.add.text(560 - 2560, 110, 'character', {color: '#452600', fontSize: '48px', fontFamily: 'Metamorphous'});
		this.charBackButton = new Button(this.onCharacterBack, 'Back', '64px', this, 160 - 2560, 850, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);
		
		// Agata
		this.char1Button = new Button(this.onSelectAgata, ' ', '64px', this, 520 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char1Icon = this.add.image(520 - 2560, 525, 'agata_icon');
		this.char1Icon.scale = 3;
		
		// Frank
		this.char2Button = new Button(this.onSelectFrank, ' ', '64px', this, 640 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char2Icon = this.add.image(640 - 2560, 525, 'frank_icon');
		this.char2Icon.scale = 3;

		// Gwynn
		this.char3Button = new Button(this.onSelectGwynn, ' ', '64px', this, 760 - 2560, 525, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char3Icon = this.add.image(760 - 2560, 525, 'gwynn_icon');
		this.char3Icon.scale = 3;

		// Roach
		this.char4Button = new Button(this.onSelectRoach, ' ', '64px', this, 520 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char4Icon = this.add.image(520 - 2560, 645, 'roach_icon');
		this.char4Icon.scale = 3;

		// Stregobor
		this.char5Button = new Button(this.onSelectStregobor, ' ', '64px', this, 640 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char5Icon = this.add.image(640 - 2560, 645, 'stregobor_icon');
		this.char5Icon.scale = 3;

		// Yenna
		this.char6Button = new Button(this.onSelectYenna, ' ', '64px', this, 760 - 2560, 645, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 32, 32);
		this.char6Icon = this.add.image(760 - 2560, 645, 'yenna_icon');
		this.char6Icon.scale = 3;

		// Character splash art
		this.player1SplashBack = this.add.nineslice(-200 - 2560, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player1SplashBack.scale = 3;
		this.player1SplashBack.visible = false;

		this.player1Splash = this.add.image(-200 - 2560, 325, 'agata_splash');
		this.player1Splash.scale = 0.25;
		this.player1Splash.visible = false;

		this.player1SplashNameplate = this.add.text(-200 - 2560, 100, 'NAME', textTitleDark);
		this.player1SplashNameplate.visible = false;

		this.player2SplashBack = this.add.nineslice(1480 - 2560, 300, 'button_normal', undefined, 125, 175, 4, 4, 4, 4, undefined, undefined)
		this.player2SplashBack.scale = 3;
		this.player2SplashBack.visible = false;

		this.player2Splash = this.add.image(1480 - 2560, 325, 'frank_splash');
		this.player2Splash.scale = 0.25;
		this.player2Splash.flipX = true;
		this.player2Splash.visible = false;

		this.player2SplashNameplate = this.add.text(1480 - 2560, 100, 'NAME', textTitleDark);
		this.player2SplashNameplate.visible = false;

		this.startGameButton = new Button(this.onStartGame, 'Start!', '40px', this, 640 - 2560, 425, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 24);
		this.startGameButton.toggleEnable();

		this.statusIndicator = this.add.image(35, 35, 'status_connected');
		this.statusIndicator.scale = 3;

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

		// Elements to tween ---------------------------
		this.elements = [
			this.backgroundSlice,
			this.title1,
			this.title2,
			this.ver,
			this.playButton, 
			this.optionsButton, 
			this.creditsButton,
			this.chatButton,
			this.chatIcon,
			this.settingsBackButton,
			this.settingsTitle,
			this.volumeLabel,
			this.volumeText,
			this.volumeDownButton,
			this.volumeUpButton,
			this.changePasswordBox,
			this.changePasswordButton,
			this.changePasswordLabel,
			this.changePasswordConfirm,
			this.throbber,
			this.throbber_shadow,
			this.deleteAccountButton,
			this.deleteAccountConfirm,
			this.deleteAccountConfirmButton,
			this.deleteAccountDenyButton,
			this.comsTitle1,
			this.comsTitle2,
			this.localButton,
			this.onlineButton,
			this.comsBackButton,
			this.creditsTitle,
			this.credits1,
			this.credits2,
			this.credits3,
			this.credits4,
			this.charBackButton,
			this.charTitle1,
			this.charTitle2,
			this.charTitleBack,
			this.char1Button,
			this.char2Button,
			this.char3Button,
			this.char4Button,
			this.char5Button,
			this.char6Button,
			this.char1Icon,
			this.char2Icon,
			this.char3Icon,
			this.char4Icon,
			this.char5Icon,
			this.char6Icon,
			this.player1SplashBack,
			this.player2SplashBack,
			this.player1Splash,
			this.player2Splash,
			this.player1SplashNameplate,
			this.player2SplashNameplate,
			this.startGameButton
		]

		this.input.on('pointerdown', function (pointer)
        {
			this.changePasswordBox.checkForSelection();

        }, this);

		if(this.online == false) // In offline mode, disable all online features
		{
			this.chatButton.visible = false;
			this.chatIcon.visible = false;
			this.changePasswordBox.visible = false;
			this.changePasswordButton.visible = false;
			this.changePasswordLabel.visible = false;
			this.changePasswordConfirm.visible = false;
			this.deleteAccountButton.visible = false;
			this.deleteAccountConfirm.visible = false;
			this.deleteAccountConfirmButton.visible = false;
			this.deleteAccountDenyButton.visible = false;
			this.statusIndicator.visible = false;
		} 
	}

	update(time, delta)
	{
		if(this.online == false) return; // Do not retry connection if on Offline Mode

		this.throbber_rotation += 0.005 * delta;
		if(this.throbber_rotation > 2 * 3.1415) this.throbber_rotation -= 2 * 3.1415;

		this.throbber.setRotation(this.throbber_rotation);
		this.throbber_shadow.setRotation(this.throbber_rotation);

		let scene = this;

		const baseUrl = '/api/status/ping';

		// Check connection
		$.get(baseUrl, function (data) {}).done(function()
		{
			scene.registry.set('connected', true);
			scene.connectionErrorShown = false;

			scene.chatButton.visible = true;
			scene.chatIcon.visible = true;
			scene.changePasswordBox.visible = true;
			scene.changePasswordButton.visible = true;
			scene.changePasswordLabel.visible = true;
			scene.deleteAccountButton.visible = true;

			scene.statusIndicator.setTexture('status_connected');

		}).fail(function(){

			scene.registry.set('connected', false);
			scene.chatButton.visible = false;
			scene.chatIcon.visible = false;
			scene.changePasswordBox.visible = false;
			scene.changePasswordButton.visible = false;
			scene.changePasswordLabel.visible = false;
			scene.changePasswordConfirm.visible = false;
			scene.deleteAccountButton.visible = false;
			scene.deleteAccountConfirm.visible = false;
			scene.deleteAccountConfirmButton.visible = false;
			scene.deleteAccountDenyButton.visible = false;

			scene.statusIndicator.setTexture('status_disconnected');

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
		});
	}

	dismissError()
	{
		this.scene.blackFade.visible = false;
		this.scene.blackFade.alpha = 0;

		this.scene.connectionErrorPanel.visible = false;
		this.scene.connectionErrorLabel.visible = false;
		this.scene.connectionErrorTextP1.visible = false;
		this.scene.connectionErrorTextP2.visible = false;
		this.scene.connectionErrorTextP3.visible = false;
		this.scene.connectionErrorButton.visible = false;
	}

	// #region Main Menu Functions ---------------------
	onPlay()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '+=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=740',
			ease: 'Cubic.inOut'
		});
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

	onChatFinish()
	{
		let scene = this.parent.scene;
		scene.scene.start("ChatRoom");
	}

	onSettings()
	{
		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			y: '-=1440',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=380',
			ease: 'Cubic.inOut'
		});
	}

	onCredits()
	{
		this.scene.tweens.chain({
			targets: null,
			tweens: [
				{
					targets: this.scene.elements,
					duration: 1000,
					x: '-=1280',
					ease: 'Cubic.inOut'
				},
				{
					targets: this.scene.creditsBackButton,
					duration: 400,
					y: '-=200',
					ease: 'Cubic.out'
				},
			],
			delay: 0
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=740',
			ease: 'Cubic.inOut'
		});
	}
	// #endregion

	// #region Settings Functions ----------------------
	onSettingsBack()
	{
		// If we have connection, update the volume on the server's storage
		if(this.scene.registry.get('connected'))
		{
			let volume = this.scene.sound.volume;
			const baseUrl = '/api/users/' + this.scene.registry.get('user') + "/volume";

			$.ajax({
				contentType: 'application/json',
				data: JSON.stringify({volume:volume}),
				dataType: 'json',
				processData: false,
				type: 'PUT',
				url: baseUrl
			});
		}

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			y: '+=1440',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=380',
			ease: 'Cubic.inOut'
		});
	}

	onMasterIncrease()
	{
		let volume = this.scene.sound.volume;
		volume += 0.1;
		// Clamp volume
		if(volume > 1) volume = 1;
		else if(volume < 0) volume = 0;

		this.scene.sound.setVolume(volume);
		this.scene.registry.set('volume', volume);
		this.scene.volumeText.text = Math.round(volume * 10);
	}

	onMasterDecrease()
	{
		let volume = this.scene.sound.volume;
		volume -= 0.1;
		// Clamp volume
		if(volume > 1) volume = 1;
		else if(volume < 0) volume = 0;

		this.scene.sound.setVolume(volume);
		this.scene.registry.set('volume', volume);
		this.scene.volumeText.text = Math.round(volume * 10);
	}

	onChangePassword()
	{
		const baseUrl = '/api/users/' + this.scene.registry.get('user') + "/password";
		let password = this.scene.changePasswordBox.submitText();
		let scene = this.scene;
		
		scene.changePasswordConfirm.visible = false;
		scene.changePasswordButton.toggleEnable();

		if(password == '')
		{
			scene.throbber.visible = false;
			scene.throbber_shadow.visible = false;
			scene.changePasswordButton.toggleEnable();
			return;
		}
		
		scene.throbber.visible = true;
		scene.throbber_shadow.visible = true;
		scene.throbber_rotation = 0;

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify({password:password}),
			dataType: 'json',
			processData: false,
			type: 'PUT',
			url: baseUrl
		}).done(function(){

			scene.throbber.visible = false;
			scene.throbber_shadow.visible = false;
			scene.changePasswordConfirm.visible = true;
			scene.changePasswordButton.toggleEnable();
		}).fail(function(){
			
			scene.throbber.visible = false;
			scene.throbber_shadow.visible = false;
			scene.changePasswordButton.toggleEnable();
		});
	}

	onDeleteAccount()
	{
		this.scene.deleteAccountConfirm.visible = true;
		this.scene.deleteAccountConfirmButton.visible = true;
		this.scene.deleteAccountDenyButton.visible = true;
	}

	onDeleteConfirm()
	{
		const baseUrl = '/api/users/' + this.scene.registry.get('user');
		let scene = this.scene;

		$.ajax({
			contentType: 'application/json',
			dataType: 'json',
			processData: false,
			type: 'DELETE',
			url: baseUrl
		}).always(function(){

			scene.registry.set('user', '');
			scene.registry.set('connected', false);
			scene.scene.start('LogReg');
		});
	}

	onDeleteDeny()
	{
		this.scene.deleteAccountConfirm.visible = false;
		this.scene.deleteAccountConfirmButton.visible = false;
		this.scene.deleteAccountDenyButton.visible = false;
	}
	// #endregion

	// #region Comms Selection Functions ---------------
	onLocal()
	{
		this.scene.tweens.chain({
			targets: null,
			tweens: [
				{
					targets: this.scene.elements,
					duration: 1000,
					x: '+=1280',
					ease: 'Cubic.inOut'
				},
				{
					targets: [this.scene.charBackLeft, this.scene.charBackRight],
					duration: 300,
					y: 360,
					ease: 'Cubic.inOut'
				},
				{
					targets: this.scene.charBackButton,
					duration: 400,
					y: '-=200',
					ease: 'Cubic.out'
				}
			],
			delay: 0
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 800,
			x: '+=380',
			ease: 'Cubic.inOut'
		});
	}

	onOnline()
	{
		this.scene.blackFade.visible = true;
		this.scene.add.tween({
			targets: this.scene.blackFade,
			duration: 1000,
			alpha: 1,
			onComplete: this.scene.toLobby
		});
	}

	toLobby()
	{
		let scene = this.parent.scene;

		scene.scene.start("Lobby");
	}

	onCommsBack()
	{

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '-=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=740',
			ease: 'Cubic.inOut'
		});
	}
	// #endregion

	// #region Character Functions ---------------------
	onSelectCharacter()
	{
		this.scene.scene.start('Game');
	}

	onSelectAgata()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'agata';
			console.log("Set player 1 to Agata");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('agata_splash');
			this.scene.player1SplashNameplate.text = "Agata";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char1Button.toggleEnable();

			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'agata';
			console.log("Set player 2 to Agata");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;

			this.scene.player2Splash.setTexture('agata_splash');
			this.scene.player2SplashNameplate.text = "Agata";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char1Button.toggleEnable();

			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}

	onSelectFrank()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'frank';
			console.log("Set player 1 to Frank");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('frank_splash');
			this.scene.player1SplashNameplate.text = "Frank";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char2Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'frank';
			console.log("Set player 2 to Frank");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;
			
			this.scene.player2Splash.setTexture('frank_splash');
			this.scene.player2SplashNameplate.text = "Frank";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char2Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}

	onSelectGwynn()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'gwynn';
			console.log("Set player 1 to Gwynn");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('gwynn_splash');
			this.scene.player1SplashNameplate.text = "Gwynn";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char3Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'gwynn';
			console.log("Set player 2 to Gwynn");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;
			
			this.scene.player2Splash.setTexture('gwynn_splash');
			this.scene.player2SplashNameplate.text = "Gwynn";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char3Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}
	
	onSelectRoach()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'roach';
			console.log("Set player 1 to Roach");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('roach_splash');
			this.scene.player1SplashNameplate.text = "Roach";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char4Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'roach';
			console.log("Set player 2 to Roach");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;
			
			this.scene.player2Splash.setTexture('roach_splash');
			this.scene.player2SplashNameplate.text = "Roach";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char4Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}
	
	onSelectStregobor()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'stregobor';
			console.log("Set player 1 to Stregobor");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('stregobor_splash');
			this.scene.player1SplashNameplate.text = "Stregobor";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char5Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'stregobor';
			console.log("Set player 2 to Stregobor");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;
			
			this.scene.player2Splash.setTexture('stregobor_splash');
			this.scene.player2SplashNameplate.text = "Stregobor";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char5Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}

	onSelectYenna()
	{
		if(this.scene.player1 == undefined)
		{
			this.scene.player1 = 'yenna';
			console.log("Set player 1 to Yenna");

			// Set the character splash screen
			this.scene.player1SplashBack.visible = true;
			this.scene.player1Splash.visible = true;
			this.scene.player1SplashNameplate.visible = true;

			this.scene.player1Splash.setTexture('yenna_splash');
			this.scene.player1SplashNameplate.text = "Yennefer";
			Phaser.Display.Align.In.Center(this.scene.player1SplashNameplate, this.scene.player1SplashBack);
			this.scene.player1SplashNameplate.y = 50;

			this.scene.char6Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player1Splash, this.scene.player1SplashBack, this.scene.player1SplashNameplate],
				duration: 1000,
				x: '+=400',
				ease: 'Cubic.inOut'
			});
		}
		else if(this.scene.player2 == undefined)
		{
			this.scene.player2 = 'yenna';
			console.log("Set player 2 to Yenna");

			// Set the character splash screen
			this.scene.player2SplashBack.visible = true;
			this.scene.player2Splash.visible = true;
			this.scene.player2SplashNameplate.visible = true;
			
			this.scene.player2Splash.setTexture('yenna_splash');
			this.scene.player2SplashNameplate.text = "Yennefer";
			Phaser.Display.Align.In.Center(this.scene.player2SplashNameplate, this.scene.player2SplashBack);
			this.scene.player2SplashNameplate.y = 50;

			this.scene.char6Button.toggleEnable();
	
			// Tween the character splash screen into view
			this.scene.add.tween({
				targets: [this.scene.player2Splash, this.scene.player2SplashBack, this.scene.player2SplashNameplate],
				duration: 1000,
				x: '-=400',
				ease: 'Cubic.inOut'
			});
			this.scene.startGameButton.toggleEnable();
		}
	}

	onStartGame()
	{
		this.scene.add.tween({
			targets: this.scene.blackFade,
			duration: 1000,
			alpha: 1,
			ease: 'Cubic.out',
			onComplete: this.scene.onFadeEnd
		});
	}

	onFadeEnd()
	{
		let scene = this.parent.scene;

		scene.scene.start('Game', {player1: scene.player1, player2: scene.player2});
	}

	onCharacterBack()
	{
		this.scene.add.tween({
			targets: this.scene.charBackButton,
			duration: 400,
			y: '+=200',
			ease: 'Cubic.out'
		});

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '-=1280',
			ease: 'Cubic.inOut',
			onComplete: this.scene.characterBackCallback
		});

		this.scene.add.tween({
			targets: this.scene.charBackLeft,
			duration: 400,
			y: -620,
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.charBackRight,
			duration: 400,
			y: 1340,
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '-=380',
			ease: 'Cubic.inOut'
		});
	}

	characterBackCallback(tween, targets)
	{
		let scene = this.parent.scene;

		// Reset the character splash art screens
		scene.player1SplashBack.visible = false;
		scene.player1Splash.visible = false;
		scene.player1SplashNameplate.visible = false;

		scene.player1SplashBack.x = -200 - 1280;
		scene.player1Splash.x = -200 - 1280;
		scene.player1SplashNameplate.x = -200 - 1280;

		scene.player2SplashBack.visible = false;
		scene.player2Splash.visible = false;
		scene.player2SplashNameplate.visible = false;

		scene.player2SplashBack.x = 1480 - 1280;
		scene.player2Splash.x = 1480 - 1280;
		scene.player2SplashNameplate.x = 1480 - 1280;

		if(scene.startGameButton.enabled) scene.startGameButton.toggleEnable();

		// Reset the character buttons and selection
		if(!scene.char1Button.enabled) scene.char1Button.toggleEnable();
		if(!scene.char2Button.enabled) scene.char2Button.toggleEnable();
		if(!scene.char3Button.enabled) scene.char3Button.toggleEnable();
		if(!scene.char4Button.enabled) scene.char4Button.toggleEnable();
		if(!scene.char5Button.enabled) scene.char5Button.toggleEnable();
		if(!scene.char6Button.enabled) scene.char6Button.toggleEnable();

		scene.player1 = undefined;
		scene.player2 = undefined;
	}
	// #endregion

	// #region Credits Functions -----------------------
	onCreditsBack()
	{
		this.scene.add.tween({
			targets: this.scene.creditsBackButton,
			duration: 400,
			y: '+=200',
			ease: 'Cubic.out'
		});

		this.scene.add.tween({
			targets: this.scene.elements,
			duration: 1000,
			x: '+=1280',
			ease: 'Cubic.inOut'
		});

		this.scene.add.tween({
			targets: this.scene.splash,
			duration: 1000,
			x: '+=740',
			ease: 'Cubic.inOut'
		});
	}
	// #endregion
	
	undefinedButton()
	{
		console.log("Undefined button");
	}

}

export default Menu;