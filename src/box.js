class Box {
    constructor(argCoordX, argCoordY, argColor, argScene, argImage) {
        this.position = [argCoordX, argCoordY];
        this.color = argColor;
        this.scene = argScene;
        this.image = argImage;
		this.player = "No Player";
    }

    setNewColor(newColor) {
        this.color = newColor;
		this.image.alpha = 1;
    }

    drawBox() {
        //this.scene.add.image(this.position[0], this.position[1], this.color).setOrigin(0, 0);
        this.image.setTintFill(this.color);
    }

	getPlayer()
	{
		return this.player;
	}

	updateSprite(x, y, grid)
	{
		// The neighbour boxes are stored as individual bits to be used as offets in the atlas
		// Neighbours -> Up | Down | Right | Left
		// Diagonal Neighbours -> T.Right | T.Left | B.Right | B.Left

		let neighbours = 0b0000;
		let diagonalNeighbours = 0b0000;
		
		if(grid[x - 1] != undefined)
		{
			if(grid[x - 1][y].player == this.player) neighbours += 0b0001;
			
			if(grid[x - 1][y - 1] != undefined)
				if(grid[x - 1][y - 1].player == this.player) diagonalNeighbours += 0b0100;
			
			if(grid[x - 1][y + 1] != undefined)
				if(grid[x - 1][y + 1].player == this.player) diagonalNeighbours += 0b0001;
		}

		if(grid[x + 1] != undefined)
		{
			if(grid[x + 1][y].player == this.player) neighbours += 0b0010;
			
			if(grid[x + 1][y - 1] != undefined)
				if(grid[x + 1][y - 1].player == this.player) diagonalNeighbours += 0b1000;
			
			if(grid[x + 1][y + 1] != undefined)
				if(grid[x + 1][y + 1].player == this.player) diagonalNeighbours += 0b0010;
		}

		if(grid[x][y + 1] != undefined)
		{
			if(grid[x][y + 1].player == this.player) neighbours += 0b0100;
		}

		if(grid[x][y - 1] != undefined)
		{
			if(grid[x][y - 1].player == this.player) neighbours += 0b1000;
		}

		let frame = new Phaser.Textures.Frame(this.image.texture, "Frame", 0, neighbours * 40, diagonalNeighbours * 40, 40, 40);
		this.image.setFrame(frame);
	}

    distance(other) {
        if (other.sprite.x > this.position[0] && other.sprite.x <= this.position[0] + 40 && other.sprite.y + 32 > this.position[1] && other.sprite.y + 32 <= this.position[1]+40) {
            this.player = other.name;
			this.setNewColor(other.color);
            this.drawBox();
        }
    }

}

export default Box;