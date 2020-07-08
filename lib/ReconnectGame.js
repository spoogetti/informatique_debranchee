import Phaser from "phaser";

import levels from "./globals/levels"
import ReconnectMap from "./ReconnectMap"
import { cardGame } from "./games/cardGame";

class ReconnectGame extends Phaser.Game {

    constructor(args){
        super(args)
        this.player = {}
    }

    configurePlayer(pseudo) {
        this.player.pseudo = pseudo
    }

    createMap() {
        this.mapScene = this.scene.scenes[0]
        this.drawBackground();

        let map = new ReconnectMap(this.mapScene, 0, 0, [])
        map.createTerrain();
        map.createLevels(levels);

        map.center()
        window.scrollTo(0, document.body.scrollHeight);

    }

    levelChoose(game) {
        if(game == "cardGame") {
            // TODO : make cardGame a scene
            this.scene.sleep(this.mapScene)
            cardGame()
        }
    }

    drawBackground() {
        let { width, height } = this.mapScene.sys.game.canvas;

        let texture = this.mapScene.textures.createCanvas('gradient', width, height);
        let context = texture.getContext();
        let grd = context.createLinearGradient(0, 0, 0, height);
      
        grd.addColorStop(0, '#7FD3F5');
        grd.addColorStop("0.3", '#3E2AA1');
        grd.addColorStop(1, '#580FA7');

      
        context.fillStyle = grd;
        context.fillRect(0, 0, width, height);
      
        //  Call this if running under WebGL, or you'll see nothing change
        texture.refresh();
      
        let gradient = this.mapScene.add.image(width / 2, height / 2, 'gradient');
    }
}

export default ReconnectGame
