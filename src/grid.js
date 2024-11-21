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
        for (let i = 0; i < 1280 / 40; i++) {
            let array = [];
            for (let j = 0; j < 720 / 40; j++) {
                let ink;

                if (i == 0 && j == 0) { ink = 'inkFrancat'; }
                else if (i == 31 && j == 17) { ink = 'inkAgata'; }
                else { ink = 'box'; }
                let box = new Box(i * 40, j * 40, ink, this.scene);
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

    updateGrid(other) {
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 18; j++) {
                this.grid[i][j].distance(other);
            }
        }
    }
}

export default Grid;
