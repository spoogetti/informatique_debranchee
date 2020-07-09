import Phaser from 'phaser';

import arrow from '../../src/assets/arrow-select.png'
import arrow_up from '../../src/assets/up.png'
import arrow_down from '../../src/assets/down.png'
import flipIcon from '../../src/assets/flip.png'
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import ReconnectGame from "../ReconnectGame";

export default class CrepeGame extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.reward = 3;

        this.values = [];
        this.shuffledValues = [];
        this.crepesAmount = 7;

        this.crepes = [];

        this.crepeHeight = 30;
        this.crepePadding = 35;
        this.crepeWidth = window.innerWidth*0.1;

        this.screenWidthHalf = window.innerWidth/2;
        this.screenWidthThird = window.innerWidth/3;
        this.screenWidthFourth = window.innerWidth/4;
        this.screenWidthHeight = window.innerWidth/8;

        this.screenHeightHalf = window.innerHeight/2;
        this.screenHeightSixth = window.innerHeight/6;

        this.yOffset = 100;

        this.hexValues = ['0xFF0000', '0xFF7F00', '0xFFFF00', '0x00FF00', "0x0000FF", "0x2E2B5F", "0x8B00FF"];

        this.arrowSelect = null;
        this.arrowUp = null;
        this.arrowDown = null;
        this.flip = null;
        this.validateButton = null;
        this.winLoseIndicator = null;
    }

    init(data) {}

    preload () {
        this.load.image('arrow', arrow);
        this.load.image('up', arrow_up);
        this.load.image('down', arrow_down);
        this.load.image('flip', flipIcon);
    }

    create() {
        let bg  = this.add.rectangle(0, this.halfW, window.innerWidth * 3, window.innerHeight*3, 0xE2AA56);

        let bg_level_header = new RoundRectangle(this, this.screenWidthHalf, 60, 120, 70, 15, 0x580FA7)
        this.add.existing(bg_level_header);

        let validate_bg = new RoundRectangle(this, window.innerWidth/2, window.innerHeight + 60, window.innerWidth - 30, window.innerHeight*2, this.screenHeightSixth/8, 0xffffff)
        this.add.existing(validate_bg);

        this.generateCrepes();
        this.generateActions();
        this.generateValidations();
    }

    generateValidations() {
        let validate_bg = new RoundRectangle(this, this.screenWidthHalf, this.screenHeightSixth * 5, this.screenWidthThird, this.screenHeightSixth/2, this.screenHeightSixth/4, 0x00FF00)
        this.add.existing(validate_bg);
        validate_bg.setInteractive().on('pointerdown', () => this.validate())

        // this.validateButton = this.add.text(this.screenWidthHalf - 35, this.screenHeightSixth * 5 - 5, 'Valider', {fill: '#000'})
        this.winLoseIndicator = this.add.text(this.screenWidthHeight, this.screenHeightSixth * 5 + 30, '', {fill: '#000'})
    }

    generateActions() {
        this.arrowSelect = this.add.image(this.screenWidthHeight - 50, this.yOffset, 'arrow');
        this.arrowSelect.setScale(0.1, 0.1)
        this.arrowSelect.position = 0

        this.arrowUp = this.add.image(this.screenWidthThird, this.screenHeightSixth * 4, 'up');
        this.arrowUp.setScale(0.1, 0.1)
        this.arrowUp.setInteractive().on('pointerdown', () => this.arrowUpEvent())

        this.arrowDown = this.add.image(this.screenWidthThird * 2, this.screenHeightSixth * 4, 'down');
        this.arrowDown.setScale(0.1, 0.1)
        this.arrowDown.setInteractive().on('pointerdown', () => this.arrowDownEvent())

        this.flip = this.add.image(this.screenWidthHalf, this.screenHeightSixth * 4, 'flip');
        this.flip.setScale(0.2, 0.2)
        this.flip.setInteractive().on('pointerdown', () => this.flipEvent())
    }

    generateCrepes() {
        for (let i = 0; i < 50; i++) {
            this.values.push(i)
        }

        this.shuffledValues = this.values.splice(0, this.crepesAmount).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)

        for (let i = 0; i < this.crepesAmount; i++) {
            let crepeWidth = this.crepeWidth * 2 + this.shuffledValues[i] * this.crepeWidth
            let posX = this.screenWidthHeight + crepeWidth / 2
            let posY = i * this.crepePadding + this.yOffset + this.crepePadding / 2

            let crepe = new RoundRectangle(this, posX, posY, crepeWidth, this.crepeHeight, 15, this.hexValues[this.shuffledValues[i]])
            this.add.existing(crepe);

            crepe.value = this.shuffledValues[i]
            this.crepes.push(crepe)
        }
    }

    arrowUpEvent() {
        // console.log('arrowUp event')
        if(this.arrowSelect.position !== 0) {
            this.arrowSelect.position--
            this.arrowSelect.y -= this.crepePadding
        }
    }

    arrowDownEvent() {
        // console.log('arrowDown event')
        if(this.arrowSelect.position !== this.crepesAmount) {
            this.arrowSelect.position++
            this.arrowSelect.y += this.crepePadding
        }
    }

    flipEvent() {
        let swapArray = this.crepes.slice(0, this.arrowSelect.position).reverse()

        swapArray.forEach((swap, index) => {
            this.crepes[index] = swap
        })

        this.crepes.forEach((crepe, index) => {
            let posX = this.screenWidthHeight + crepe.width/2
            let posY = index * this.crepePadding + this.yOffset + this.crepePadding/2

            crepe.x = posX
            crepe.y = posY
        })
    }

    validate() {
        let arrayEntry = 0
        let won = true
        this.crepes.forEach((crepe) => {
            if(crepe.value > arrayEntry) {
                won = false
                return
            }
            arrayEntry++
        })
        this.winLoseIndicator.setText(won ? "win, congratz" : "Pas encore !")

        if(true) {
            window.scroll(0, window.innerHeight)
            this.scene.stop(this.key)
            this.game.availablePipes += this.reward
            this.game.backToMap()
        }
    }
}
