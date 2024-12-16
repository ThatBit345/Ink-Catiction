class TextEntry extends Phaser.GameObjects.Container
{
	constructor(scene, x, y, width, height, normal_texture, selected_texture, placeholder, text_format, placeholder_format)
	{
		super(scene, x, y, undefined);

		this.selected = false;
		this.hovered = false;
		this.textFormat = text_format;
		this.placeholderFormat = placeholder_format;
		this.placeholderText = placeholder;
		this.normal_texture = normal_texture;
		this.selected_texture = selected_texture;

		this.nslice = scene.add.nineslice(0, 0, normal_texture, undefined, width, height, 4, 4, 4, 4, undefined, undefined);
		this.nslice.scale = 3;

		let rectX = -(width * 3) / 2;
		let rectY = -(height * 3) / 2;

		this.placeholder = scene.add.text(rectX + 10, rectY + 16, placeholder, placeholder_format);
		this.text = scene.add.text(rectX + 10, rectY + 16, "", text_format);

		this.add(this.nslice);
		this.add(this.placeholder);
		this.add(this.text);
		
		this.setInteractive(new Phaser.Geom.Rectangle(rectX, rectY, width * 3, height * 3), Phaser.Geom.Rectangle.Contains);
		scene.add.existing(this);

		scene.input.keyboard.on('keydown', event =>
		{
			if(!this.selected) return;
			
			if (event.keyCode === 8 && this.text.text.length > 0)
			{
				this.text.text = this.text.text.substr(0, this.text.text.length - 1);
			}
			else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
			{
				this.text.text += event.key;
			}

			this.placeholder.visible = this.text.text == "";
		});

		this.on('pointerover', function (event)
        {
            this.hovered = true;
        });

        this.on('pointerout', function (event)
        {
            this.hovered = false;
        });
	}

	checkForSelection()
	{
		this.selected = this.hovered;
		if(this.selected) this.nslice.setTexture(this.selected_texture);
		else this.nslice.setTexture(this.normal_texture);
	}

	submitText()
	{
		let entry = this.text.text;
		this.text.text = "";
		this.placeholder.visible = true;

		return entry;
	}
}
export default TextEntry;