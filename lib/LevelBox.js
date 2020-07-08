import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import styles from "./styles";

class LevelBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, content, difficulty, width=75, height=75, radius=10) {
        super(scene, x, y)
        this.setSize(width, height)

        // prepare box
        this.box = new RoundRectangle(this.scene, 0, 0, width, height, radius, styles.difficultiesColors[difficulty], 1)
        this.add(this.box)

        // prepare text
        this.text = new Phaser.GameObjects.Text(
            this.scene, 0, 0, content, 
            {
                fontSize: "42px", 
                fontStyle: "bold",
            }
        )
        this.text.setPosition(this.text.x - this.text.width / 2, this.text.y - this.text.height / 2 + 2)
        this.add(this.text)
    }
}

export default LevelBox