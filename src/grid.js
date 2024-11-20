import Box from './box.js';

class Grid {
    constructor(argScene) {
        this.scene = argScene;
        this.grid = this.generateGrid();
    }

    generateGrid() {
        let matrix = [];
        for (let i = 0; i < 1280 / 40; i++) {
            let array = [];
            for (let j = 0; j < 720 / 40; j++) {
                let box = new Box(i, j);
                console.log("Coordenadas de la casilla: X " +box.position[0]+ " Y " +box.position[1]);
                this.scene.add.image(box.position[0],box.position[1],'box');
                array.push(box);
            }
            matrix.push(array);
        }
    }
}

export default Grid;
