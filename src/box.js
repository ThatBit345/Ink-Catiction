class Box {
    constructor(argCoordX, argCoordY, argColor, argScene) {
        this.position = [argCoordX, argCoordY];
        this.color = argColor;
        //this.nextColor = this.color;
        this.scene = argScene;
    }

    setNewColor(newColor) {
        this.color = newColor;
    }

    drawBox() {
        this.scene.add.image(this.position[0],this.position[1],this.color);
    }

}

export default Box;