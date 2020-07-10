import Phaser from "phaser";
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import validateBtn from '../../src/assets/validate.png'

export default class CardGame extends Phaser.Scene {
    constructor(config) {
        // console.log("cardGame constructor")

        super(config);

        this.cards = [];
        this.values = [];

        this.displayName = "Cartes"
        this.levelGain = 2;
        this.reward = 1;
        this.name = "cardGame"

        this.shuffledValues = [];
        this.selectedCards = [];

        this.cardAmount = 5;
        this.cardOriginalPos = {};
        this.depth = 0;
        this.cardToFlip = false;
        this.blinkAnimInterval = null
        this.blinks = 0

        this.validateButton = null;
        this.winLoseIndicator = null;

        this.halfW = window.innerWidth/2;
        this.halfH = window.innerHeight/2;

        this.fourthW = window.innerWidth/4;
        this.fourthH = window.innerHeight/4;

        this.heightW = window.innerWidth/8;
        this.heightH = window.innerHeight/8;

        // Aspect ratio of card 8/5 -> 1.6
        this.cardDims = {frameWidth: (window.innerHeight/8) / 1.6, frameHeight: (window.innerHeight/8)};

        this.fillColor = 0xEC3858;
        this.highLightColor = 0x7FD3F5;

        this.validateBtn = null;
    }

    init(data) {}

    preload () {
        this.load.image('validate', validateBtn);
    }

    create (data)  {
        let bg  = this.add.rectangle(this.halfW, this.halfW, window.innerWidth, window.innerHeight*3, 0xffffff);
        this.generateCards();

        // this.validateButton = this.add.text(this.fourthW, (this.cardAmount + 1) * this.heightH, 'Valider', { fill: '#000' })
        //     .setInteractive()
        //     .on('pointerdown', () => this.validate() )
        // .on('pointerover', () => this.enterButtonHoverState() )
        // .on('pointerout', () => this.enterButtonRestState() );

        // let validate_bg = new RoundRectangle(this, this.halfW, (this.cardAmount + 2) * this.heightH, this.fourthW, this.heightH/2, this.heightH/4, 0x00FF00)
        // this.add.existing(validate_bg);
        // validate_bg.setInteractive().on('pointerdown', () => this.validate())

        this.validateBtn = this.add.image(this.halfW, (this.cardAmount + 2) * this.heightH, 'validate');
        this.validateBtn.setScale(0.5, 0.5)
        this.validateBtn.setInteractive().on('pointerdown', () => this.validate())

        this.winLoseIndicator = this.add.text(this.fourthW, (this.cardAmount + 2) * this.heightH + 30, '', { fill: '#000' })
    }

    generateCards() {
        for (let i = 0; i < 100; i++) {
            this.values.push(i)
        }

        this.shuffledValues = this.values.splice(0, this.cardAmount).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
        this.selectedCards = []

        // console.log(this.shuffledValues)

        for (let i = 0; i < this.cardAmount; i++) {
            let posX = this.halfW
            let posY = this.heightH * 2 + i * this.heightH

            // let card = this.add.rectangle(posX, posY, this.cardDims.frameWidth, this.cardDims.frameHeight, this.fillColor);
            // scene, x, y, width, height, radiusConfig, fillColor, fillAlpha
            let card = new RoundRectangle(this, posX, posY, this.cardDims.frameWidth, this.cardDims.frameHeight, 5, this.fillColor, 1)
            this.add.existing(card);
            card.highlighted = false
            card.angle = 90
            card.value = this.shuffledValues[i]
            card.index = i
            this.bindCardEvents.call(this, card);
            this.cards.push(card)
        }
    }

    update(time, delta) {}

    bindCardEvents(card) {
        let ref = this

        // Hitbox
        let shape = new Phaser.Geom.Rectangle(0, 0, this.cardDims.frameWidth, this.cardDims.frameHeight);
        card.setInteractive(shape, Phaser.Geom.Rectangle.Contains);

        //  Input Event listeners
        card.on('pointerover', function () {
            // console.log('pointerhover')
            card.setAlpha(0.8);
        });


        card.on('pointerout', function () {
            if(ref.selectedCards.length === 0 || ref.selectedCards[0] !== card)
                card.setAlpha(1);
            else if(ref.selectedCards.length === 1 || ref.selectedCards[0] === card) {
                card.setAlpha(0.5)
            }
        });

        this.input.setDraggable(card);
        this.input.on('drag', function (pointer, card, dragX, dragY) {
            if(!card.dragging) {
                ref.setCardOriginalPos(card.x, card.y)
                // console.log("setoriginalpos", cardOriginalPos)
                card.dragging = true;
            }

            card.setDepth(++ref.depth)
            card.x = dragX;
            card.y = dragY;
        });

        card.on('pointerup', () => {
            // console.log('pointerup')
            if(!card.dragging) {
                if(this.cardToFlip) {
                    this.cardToFlip.setFillStyle(this.fillColor)
                    this.cardToFlip = false
                    window.clearInterval(this.blinkAnimInterval)
                }

                if(this.selectedCards[0] !== card) {
                    this.selectedCards.push(card)
                    card.setAlpha(0.5);
                } else if (this.selectedCards.length === 1 && this.selectedCards[0] === card) {
                    this.selectedCards.pop()
                    card.setAlpha(1)
                }
            } else {
                card.dragging = false;
                this.swapCards(this.cardOriginalPos, {"x": card.x, "y": card.y}, card)
            }

            if(this.selectedCards.length === 2) {
                let card1 = this.selectedCards[0]
                let card2 = this.selectedCards[1]
                // console.log(card1.value, card2.value)

                if(card1.value > card2.value) {
                    card2.setFillStyle(this.highLightColor)
                    card2.highlighted = true
                    this.cardToFlip = card2
                    this.blinkAnimInterval = setInterval(this.blinkAnim.bind(this), 300);
                } else if(card1.value < card2.value) {
                    card1.setFillStyle(this.highLightColor)
                    card1.highlighted = true
                    this.cardToFlip = card1
                    this.blinkAnimInterval = setInterval(this.blinkAnim.bind(this), 300);
                }

                card1.setAlpha(1)
                card2.setAlpha(1)
                this.selectedCards = []
            }
        })
    }

    swapCards(cardOriginalPos, cardNewPos, dragged) {
        // console.log(dragged)
        let newPos = null

        this.cards.forEach((card, index) => {
            // Fonctions natives de phaser inutiles
            // console.log(Phaser.Geom.Rectangle.Intersection(card, dragged))
            // console.log(Phaser.Geom.Intersects.GetRectangleIntersection(card, dragged))

            let intersect = Phaser.Geom.Rectangle.ContainsPoint(card, dragged.getBottomRight()) ||
                Phaser.Geom.Rectangle.ContainsPoint(card, dragged.getBottomLeft()) ||
                Phaser.Geom.Rectangle.ContainsPoint(card, dragged.getTopRight()) ||
                Phaser.Geom.Rectangle.ContainsPoint(card, dragged.getTopLeft())

            if (card.index !== dragged.index && intersect) {
                newPos = index
            }
        })

        // console.log(dragged.index)
        // console.log(this.cards.map((card) => card.value))

        if (newPos !== dragged.index && newPos !== null) {
            // échange dans le tableau qui contient les objets
            let tempCard = this.cards[dragged.index]
            this.cards[dragged.index] = this.cards[newPos]
            this.cards[newPos] = tempCard

            this.cards[dragged.index].index = dragged.index
            dragged.index = newPos
        }

        // console.log(this.cards.map((card) => card.value))

        // console.log(dragged.index)

        for (let i = 0; i < this.cardAmount; i++) {
            this.cards[i].x = this.halfW
            this.cards[i].y = this.heightH * 2 + i * this.heightH
        }
    }

    setCardOriginalPos(posX, posY) {
        this.cardOriginalPos = {"x": posX, "y": posY}
    }

    validate() {
        let won = this.isSorted()

        // Chack reversed array if player think he's smart
        if(!won) {
            this.cards.reverse()
            won = this.isSorted()
            this.cards.reverse()
        }

        let event = new CustomEvent("reconnect-level-guess", {
            detail: {
                level: this,
                won: won
            }
        })

        this.game.canvas.dispatchEvent(event)
    }

    isSorted() {
        let arrayEntry = 0
        let won = true

        this.cards.forEach((card) => {
            if(card.value > arrayEntry) {
                won = false
                return
            }
            arrayEntry++
        })

        return won
    }

    blinkAnim() {
        // console.log(this.cardToFlip)
        if(this.cardToFlip) {
            if(!this.cardToFlip.highlighted) {
                // console.log('blinkAnim highlight')
                this.cardToFlip.setFillStyle(this.highLightColor)
                this.cardToFlip.highlighted = true
                this.blinks++
            } else {
                // console.log('blinkAnim normal')
                this.cardToFlip.setFillStyle(this.fillColor)
                this.cardToFlip.highlighted = false
                if(this.blinks === 2) {
                    clearInterval(this.blinkAnimInterval)
                    this.blinks = 0
                }
            }
        } else {
            clearInterval(this.blinkAnimInterval)
            this.blinks = 0
        }
    }
}
