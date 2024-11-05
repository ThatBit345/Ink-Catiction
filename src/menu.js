class Menu extends Phaser.Scene
{
	constructor()
	{
		super('Menu');
	}

	init(data)
	{

	}

	preload()
	{
		this.load.image('cat', '../assets/cat.png');
	}

	create(data)
	{
		const cat = this.add.image(640, 360, 'cat');
		cat.scale = 2;
	}

	update(time, delta)
	{
		
	}
}

export default Menu;