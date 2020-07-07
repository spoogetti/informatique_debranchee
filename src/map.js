import Phaser from "phaser";

import ReconnectMap from "../lib/ReconnectMap";

const map = {
    init(scene) {
        this.scene = scene;
        let map = new ReconnectMap(this.scene, 0, 0, [])

        // map.setPosition(70, 70)
        let { width, height } = scene.sys.game.canvas;
        map.setSize(width - 70, height - 70)
        map.setPosition(70, 70)
        map.createTerrain()

    }
}

export default map