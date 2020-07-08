import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

class Pipe extends RoundRectangle {
    constructor(scene, x, y, width, height, radius=7, fillColor=0x9a78cc, fillAlpha=1) {
        super(scene, x, y, width, height, radius, fillColor, fillAlpha);
    }
}

export default Pipe