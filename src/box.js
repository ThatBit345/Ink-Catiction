class Box {
    constructor(argCoordX, argCoordY, argColor, argScene) {
        this.position = [argCoordX, argCoordY];
        this.color = argColor;
        this.scene = argScene;
    }

    setNewColor(newColor) {
        this.color = newColor;
    }

    drawBox() {
        this.scene.add.image(this.position[0], this.position[1], this.color).setOrigin(0, 0);
    }

    distance(other) {
        if (other.sprite.x > this.position[0] && other.sprite.x <= this.position[0] + 40 && other.sprite.y > this.position[1] && other.sprite.y <= this.position[1]+40) {
            this.setNewColor(other.color);
            this.drawBox();
        }
    }

}

export default Box;