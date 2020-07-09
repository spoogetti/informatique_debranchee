import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import styles from "../globals/styles";
import { cardGame } from "../games/cardGame";

class LevelBox extends Phaser.GameObjects.Container {
    constructor(map, scene, x, y, level, width=30, height=30, radius=6) {
        super(scene, x, y)
        this.setSize(width, height)

        // bind data
        this.map = map
        this.difficulty = level.difficulty
        this.content = level.content
        this.game = level.game
        this.locked = level.locked

        // prepare box
        this.box = new RoundRectangle(this.scene, 0, 0, width, height, radius, styles.difficultiesColors[this.difficulty], 1)
        this.add(this.box)

        if(this.locked) {
            this.lock()
        } else {
            this.setText()
        }

        this.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.map.levelClicked(this);
        });
    }

    setText() {
        // prepare text
        this.text = new Phaser.GameObjects.Text(
            this.scene, 0, 0, this.content, 
            {
                fontSize: "16px", 
                fontStyle: "bold",
            }
        )
        this.text.setPosition(this.text.x - this.text.width / 2, this.text.y - this.text.height / 2 + 2)
        this.add(this.text)
    }

    lock() {
        this.box.fillColor = styles.colors.disabled
        this.iconLock = this.scene.add.image(this.box.getCenter().x, this.box.getCenter().y, 'lock')
        this.add(this.iconLock)
        this.iconLock.setScale(.9)
        this.locked = true
    }

    unlock() {
        this.setText()
        this.box.fillColor = styles.difficultiesColors[this.difficulty]
        this.locked = false
    }
}

export default LevelBox