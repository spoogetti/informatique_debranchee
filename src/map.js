import Phaser from "phaser";

import ReconnectMap from "../lib/ReconnectMap";
import levels from "../lib/levels";


const map = {

    destroyedPipesRow: [9, 13, 14, 21, 22, 24, 28],

    destroyedPipesCol: [3, 4, 5, 7, 11, 14, 16, 19, 21, 23, 31, 35],

    init(scene) {
        this.scene = scene;
        this.drawBackground()

        let map = new ReconnectMap(this.scene, 0, 0, [])

        map.createTerrain(this.destroyedPipesRow, this.destroyedPipesCol)
        map.createLevels(levels)

        map.center()
        window.scrollTo(0, document.body.scrollHeight);
    },

    drawBackground() {
        let { width, height } = this.scene.sys.game.canvas;

        var texture = this.scene.textures.createCanvas('gradient', width, height);
        var context = texture.getContext();
        var grd = context.createLinearGradient(0, 0, 0, height);
      
        grd.addColorStop(0, '#7FD3F5');
        grd.addColorStop("0.3", '#3E2AA1');
        grd.addColorStop(1, '#580FA7');

      
        context.fillStyle = grd;
        context.fillRect(0, 0, width, height);
      
        //  Call this if running under WebGL, or you'll see nothing change
        texture.refresh();
      
        let gradient = this.scene.add.image(width / 2, height / 2, 'gradient');
    }
}

export default map