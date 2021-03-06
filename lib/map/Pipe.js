import Phaser from "phaser"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

class Pipe extends RoundRectangle {
    constructor(map, scene, x, y, width, height, radius=3, fillColor=0x9a78cc, fillAlpha=1) {
        super(scene, x, y, width, height, radius, fillColor, fillAlpha);
        this.map = map
        this.locked = true;

        this.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.map.pipeClicked(this);
        });
    }

    isHorizontal() {
        return this.width >= this.map.pipeLength
    }

    unlock() {
        if(this.locked) {
            this.fillColor = 0xffffff
            if(this.isHorizontal()){
                this.width += this.map.padding + 2
            } else {
                this.height += this.map.padding + 2
            }
            this.locked = false;
        }
    }

    // Check if a pipe locked is close to an unlocked
    canBeUnlocked() {
        let filter = this.map.pipes.filter(p =>
            p != this &&
            !p.locked &&
            p.getClosePipes().includes(this)
        )

        return filter.length
    }

    getClosePipes() {
        let dist = 60
        let filter = this.map.pipes.filter(p =>
            p != this &&
            this.getTopCenter().distance(p.getTopCenter()) < dist ||
            this.getBottomCenter().distance(p.getTopCenter()) < dist ||
            this.getLeftCenter().distance(p.getTopCenter()) < dist ||
            this.getRightCenter().distance(p.getTopCenter()) < dist ||

            this.getTopCenter().distance(p.getBottomCenter()) < dist ||
            this.getBottomCenter().distance(p.getBottomCenter()) < dist ||
            this.getLeftCenter().distance(p.getBottomCenter()) < dist ||
            this.getRightCenter().distance(p.getBottomCenter()) < dist 
        )
        
        return filter
    }
}

export default Pipe