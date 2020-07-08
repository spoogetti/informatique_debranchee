import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

class Pipe extends RoundRectangle {
    constructor(map, scene, x, y, width, height, radius=3, fillColor=0x9a78cc, fillAlpha=1) {
        super(scene, x, y, width, height, radius, fillColor, fillAlpha);
        this.map = map
        this.locked = true;
    }

    isHorizontal() {
        return this.width >= this.map.pipeLength
    }

    unlock() {
        this.fillColor = 0xffffff
        if(this.isHorizontal()){
            this.width += this.map.padding
        } else {
            this.height += this.map.padding
        }
        this.locked = false;
    }
}

export default Pipe