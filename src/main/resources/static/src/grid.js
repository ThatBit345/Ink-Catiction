import Box from './box.js';

class Grid {
    constructor(argScene, argImage) {
        this.scene = argScene;
        this.image = argImage;
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
                let ink = '0x4fff00';
                let sprite = this.scene.add.image(i * 40, j * 40, this.image).setOrigin(0, 0);
				let frame = new Phaser.Textures.Frame(sprite.texture, "Frame", 0, 0, 0, 40, 40);
				sprite.frame = frame;
				sprite.alpha = 0;
                let box = new Box(i * 40, j * 40, ink, this.scene, sprite);

                array.push(box);
            }
            matrix.push(array);
        }
        return matrix;
    }

    updateGrid(other) {
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 18; j++) {
                this.grid[i][j].distance(other);
				this.grid[i][j].updateSprite(i, j, this.grid);
            }
        }
    }

    countColors() {
        let player1counter = 0;
        let player2counter = 0;
        for (let i = 0; i < 1280 / 40; i++) {
            for (let j = 0; j < 720 / 40; j++) {
                let box = this.grid[i][j];
                if(box.getPlayer() == "Player 1") {
                    player1counter++;
                } else if (box.getPlayer() == "Player 2") {
                    player2counter++;
                }
            }
        }
        return [player1counter, player2counter];
    }
}

export default Grid;
