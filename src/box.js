class Box {
    constructor(argCoordX, argCoordY, argColor, argScene, argImage) {
        this.position = [argCoordX, argCoordY];
        this.color = argColor;
        this.scene = argScene;
        this.image = argImage;
    }

    setNewColor(newColor) {
        this.color = newColor;
    }

    drawBox() {
        //this.scene.add.image(this.position[0], this.position[1], this.color).setOrigin(0, 0);
        this.image.setTintFill(this.color);
    }

	updateSprite()
	{
		
	}

    distance(other) {
        if (other.sprite.x > this.position[0] && other.sprite.x <= this.position[0] + 40 && other.sprite.y + 32 > this.position[1] && other.sprite.y + 32 <= this.position[1]+40) {
            this.setNewColor(other.color);
            this.drawBox();
        }
    }

}

export default Box;