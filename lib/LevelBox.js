import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import styles from "./styles";
import { cardGame } from "../src/games/cardGame";

class LevelBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, content, difficulty, width=30, height=30, radius=3) {
        super(scene, x, y)
        this.setSize(width, height)

        // prepare box
        this.box = new RoundRectangle(this.scene, 0, 0, width, height, radius, styles.difficultiesColors[difficulty], 1)
        this.add(this.box)

        // prepare text
        this.text = new Phaser.GameObjects.Text(
            this.scene, 0, 0, content, 
            {
                fontSize: "16px", 
                fontStyle: "bold",
            }
        )
        this.text.setPosition(this.text.x - this.text.width / 2, this.text.y - this.text.height / 2 + 2)
        this.add(this.text)

        this.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.scene.sys.game.destroy(true); 
            cardGame()
        });
    }
}

export default LevelBox