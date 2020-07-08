import Phaser from 'phaser';
import arrow from '../assets/arrow-select.png'
import arrow_up from '../assets/up.png'
import arrow_down from '../assets/down.png'
import flipIcon from '../assets/flip.png'

export let crepeGame = () => {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaserGame',
        width: 1920,
        height: 1080,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        backgroundColor: '#ffffff',
        scene: {
            preload: preload,
            create: create
        }
    };

    let game = new Phaser.Game(config);
    let values = []
    let shuffledValues = []
    let crepesAmount = 6

    let crepes = []

    let crepeHeight = 30
    let crepeWidth = window.innerWidth*0.1

    let screenWidthHalf = window.innerWidth/2
    let screenWidthThird = window.innerWidth/3
    let screenWidthFourth = window.innerWidth/4

    let screenHeightHalf = window.innerHeight/2

    let xOffset = window.innerWidth*0.2
    let yOffset = 100

    let hexValues = ['0xFF0000', '0xFF7F00', '0xFFFF00', '0x00FF00', "0x0000FF", "0x2E2B5F", "0x8B00FF"]

    let arrowSelect
    let arrowUp
    let arrowDown
    let flip
    let validateButton
    let winLoseIndicator

    function preload() {
        this.load.image('arrow', arrow);
        this.load.image('up', arrow_up);
        this.load.image('down', arrow_down);
        this.load.image('flip', flipIcon);

        // card sprite sheet
        // this.load.image('cards', cards);
        // this.load.spritesheet('cards', cards, { frameWidth: 167, frameHeight: 243 });
        // this.load.spritesheet('fancyCards', fCards, cardSpriteDims);
    }

    function create() {
        for (let i = 0; i < 50; i++) {
            values.push(i)
        }
        shuffledValues = values.splice(0, crepesAmount).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)

        for (let i = 0; i < crepesAmount; i++) {
            let posX = xOffset
            let posY = i * crepeHeight + yOffset
            // let card = this.add.sprite(posX, posY,'fancyCards', 7);
            let crepe = this.add.rectangle(posX, posY, crepeWidth * 2 + shuffledValues[i] * crepeWidth, crepeHeight);
            crepe.value = shuffledValues[i]

            let graphics = this.add.graphics({ fillStyle: { color: hexValues[shuffledValues[i]] } });
            graphics.fillRectShape(crepe);

            crepe.graphics = graphics
            // bindCrepeEvents.call(this, crepe);
            crepes.push(crepe)
        }

        arrowSelect = this.add.image(xOffset - 50, yOffset, 'arrow');
        arrowSelect.setScale(0.1, 0.1)
        arrowSelect.position = 0

        arrowUp = this.add.image(screenWidthThird, 350, 'up');
        arrowUp.setScale(0.1, 0.1)
        arrowUp.setInteractive().on('pointerdown', () => arrowUpEvent())

        arrowDown = this.add.image(screenWidthThird * 2, 350, 'down');
        arrowDown.setScale(0.1, 0.1)
        arrowDown.setInteractive().on('pointerdown', () => arrowDownEvent())

        flip = this.add.image(screenWidthHalf, 350, 'flip');
        flip.setScale(0.2, 0.2)
        flip.setInteractive().on('pointerdown', () => flipEvent())

        validateButton = this.add.text(xOffset, 450, 'Victory check button', { fill: '#0f0' })
            .setInteractive().on('pointerdown', () => validate())

        winLoseIndicator = this.add.text(xOffset, 480, '', { fill: '#0f0' })
    }

    function arrowUpEvent() {
        console.log('arrowUp event')
        if(arrowSelect.position !== 0) {
            arrowSelect.position--
            arrowSelect.y -= crepeHeight
        }
    }

    function arrowDownEvent() {
        console.log('arrowDown event')
        if(arrowSelect.position !== crepesAmount) {
            arrowSelect.position++
            arrowSelect.y += crepeHeight
        }
    }

    function flipEvent() {
        let swapArray = crepes.slice(0, arrowSelect.position).reverse()

        swapArray.forEach((swap, index) => {
            crepes[index] = swap
        })

        crepes.forEach((crepe, index) => {
            let posX = xOffset
            let posY = yOffset + index * crepeHeight
            crepe.x = posX
            crepe.y = posY

            // crepe.graphics.x = 0
            // crepe.graphics.y = 0
            crepe.graphics.clear()
            crepe.graphics.fillRectShape(crepe)
        })
    }

    function validate() {
        let arrayEntry = 0
        let won = true
        crepes.forEach((crepe) => {
            if(crepe.value > arrayEntry) {
                won = false
                return
            }
            arrayEntry++
        })
        winLoseIndicator.setText(won ? "win, congratz" : "lost :/")
    }
}
