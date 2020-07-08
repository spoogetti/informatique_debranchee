import Phaser from "phaser";

import ReconnectMap from "../lib/ReconnectMap";

const map = {
    init(scene) {
        this.scene = scene;
        this.drawBackground()

        let map = new ReconnectMap(this.scene, 0, 0, [])

        map.createTerrain()
        map.center()
    },

    drawBackground() {
        let { width, height } = this.scene.sys.game.canvas;

        var texture = this.scene.textures.createCanvas('gradient', width, height);
        console.log(texture)
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