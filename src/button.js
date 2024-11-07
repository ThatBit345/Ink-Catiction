class Button extends Phaser.GameObjects.Container
{
	constructor(callback, label, scene, x, y, normal_texture, highlighted_texture, pressed_texture, disabled_texture, width) 
	{
		super(scene, x, y, undefined);

		this.callback = callback;
		this.normal_texture = normal_texture;
		this.highlighted_texture = highlighted_texture;
		this.pressed_texture = pressed_texture;
		this.disabled_texture = disabled_texture;
		this.enabled = true;

		let rectX = -(width * 3) / 2;
		let rectY = -96 / 2;
		
		this.on('pointerover', this.onPointerOver);
		this.on('pointerout', this.onPointerOut);
		this.on('pointerdown', this.onPointerDown);
		this.on('pointerup', this.onPointerUp);

		this.nslice = scene.add.nineslice(0, 0, normal_texture, undefined, width, 1, 4, 4, undefined, undefined);
		this.nslice.scale = 3;

		this.label = scene.add.text(0, 0, label, {color: '#000', fontSize: '64px', fontFamily: 'Metamorphous'});
		Phaser.Display.Align.In.Center(this.label, this.nslice);

		this.add(this.nslice);
		this.add(this.label);

		this.setInteractive(new Phaser.Geom.Rectangle(rectX, rectY, width * 3, 96), Phaser.Geom.Rectangle.Contains);
		scene.add.existing(this);
    }

	onPointerOver()
	{
		if(this.enabled) this.nslice.setTexture(this.highlighted_texture);
	}

	onPointerOut()
	{
		if(this.enabled) this.nslice.setTexture(this.normal_texture);
	}

	onPointerDown()
	{
		if(this.enabled) this.nslice.setTexture(this.pressed_texture);
	}

	onPointerUp()
	{
		if(this.enabled) 
		{
			this.callback();
			this.nslice.setTexture(this.highlighted_texture);
		}
	}

	toggleEnable()
	{
		this.enabled = !this.enabled;

		if(this.enabled) this.nslice.setTexture(this.normal_texture);
		else this.nslice.setTexture(this.disabled_texture);
	}
}

export default Button;