import Phaser from "phaser";
import Pipe from "./Pipe";

class ReconnectMap extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        // ...
        scene.add.existing(this);
        this.scene = scene
    }
    // ...

    // preUpdate(time, delta) {}
    createTerrain() {
        const numberRows = 7;
        const numberCols = 4;

        const padding = 40;
        const pipeLength = 50;

        this.createRows(numberRows, numberCols, pipeLength, padding)
        this.createCols(numberRows, numberCols, pipeLength, padding)        
    }

    createCols(numberRows, numberCols, pipeLength, padding) {
        let pixelsCols = 0
        let pixelsRows = 0
        let counterRows = 1
        let counter = 0
        while(pixelsRows < this.height && counterRows <= numberRows) {
            counter++
            
            let pipe = new Pipe(this.scene, pixelsCols, pixelsRows, 0, pipeLength)
            this.add(pipe)

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
        while(pixelsCols < this.width && counterRows <= numberRows) {
            counter++
            
            let pipe = new Pipe(this.scene, pixelsCols + pipeLength / 2 + padding / 2, pixelsRows - pipeLength / 2 - padding / 2, pipeLength, 0)
            this.add(pipe)

            pixelsCols += pipeLength + padding
            if(counter % 3 == 0 && counter != 1) {
                counterRows++
                pixelsRows += pipeLength + padding
                pixelsCols = 0
            }
        } 
    }
}



export default ReconnectMap