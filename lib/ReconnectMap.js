import Phaser from "phaser";
import Pipe from "./Pipe";
import LevelBox from "./LevelBox";

class ReconnectMap extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        // ...
        scene.add.existing(this);
        this.scene = scene

        this.numberCols = 4
        this.numberRows = 15
        // use innerWidth to have a width depending of screen size
        this.padding = window.innerWidth / 15;
        this.pipeLength = window.innerWidth / 10;
    }

    createTerrain() {
        this.createRows(this.numberRows, this.numberCols, this.pipeLength, this.padding)
        this.createCols(this.numberRows, this.numberCols, this.pipeLength, this.padding)

        this.setSize(this.first.x - this.last.x, this.first.y - this.last.y)
    }

    createCols(numberRows, numberCols, pipeLength, padding) {
        let pixelsCols = 0
        let pixelsRows = 0
        let counterRows = 1
        let counter = 0
        while(counterRows + 1 <= numberRows) {
            counter++
            let random_boolean = Math.random() >= 0;
            
            if(random_boolean && counter != 1) {
                let pipe = new Pipe(this.scene, pixelsCols, pixelsRows, 0, pipeLength)
                this.add(pipe)
            }

            pixelsCols += pipeLength + padding
            if(counter % numberCols == 0 && counter != 1) {
                counterRows++
                pixelsRows += pipeLength + padding
                pixelsCols = 0
            }
        } 
    }

    createRows(numberRows, numberCols, pipeLength, padding) {
        let pixelsCols = 0
        let pixelsRows = 0
        let counterRows = 1
        let counter = 0
        while(counterRows <= numberRows) {
            counter++
            let random_boolean = Math.random() >= 0;
            
            if(random_boolean && counterRows != numberRows) {
                let pipe = new Pipe(this.scene, pixelsCols + pipeLength / 2 + padding / 2, pixelsRows - pipeLength / 2 - padding / 2, pipeLength, 0)
                this.add(pipe)
            }

            pixelsCols += pipeLength + padding
            if(counter % 3 == 0 && counter != 1) {
                counterRows++
                pixelsRows += pipeLength + padding
                pixelsCols = 0
            }
        } 
    }

    createLevels(levels) {
        levels.forEach(level => {
            let node = level.node
            let x = node[0] * (this.pipeLength + this.padding)
            let y = (this.numberRows - node[1] - 1) * (this.pipeLength + this.padding) - this.padding / 2
            let lvl = new LevelBox(this.scene, x, y, level.content, level.difficulty)
            lvl.setPosition(x, y - lvl.height / 2 - 14)
            this.add(lvl)
        })
    }

    center() {
        let { width, height } = this.scene.sys.game.canvas;
        this.setPosition(width / 2 - 45 + this.width / 2, height / 2 + this.height / 2)
        // fix to don't be at bottom
        this.setPosition(this.x, this.y - 60)
    }
}



export default ReconnectMap