import Box from './box.js';

class Grid {
    constructor(argScene, argImage) {
        this.scene = argScene;
        this.image = argImage
        this.grid = this.generateGrid();
    }

    setImage(newImage) {
        this.image = newImage;
    }

    generateGrid() {
        let matrix = [];
        for (let i = 0; i < 1280 / 32; i++) {
            let array = [];
            for (let j = 0; j < 720 / 32; j++) {
                let ink;

                if (i == 3 && j == 3) { ink = 'inkFrancat'; }
                else if (i == 38 && j == 21) { ink = 'inkAgata'; }
                else { ink = 'box'; }
                let box = new Box(i * 32, j * 32, ink, this.scene);

                box.drawBox();

                array.push(box);
            }
            matrix.push(array);
        }
        return matrix;
    }

    /*drawGrid(x, y) {
        console.log("CoordX: " + this.grid[x][y].position[0]);
        this.scene.add.image(this.grid[x][y].position[0], this.grid[x][y].position[1], this.image);
    }*/
}

export default Grid;
