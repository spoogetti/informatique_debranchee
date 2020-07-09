import Phaser from "phaser";
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

export default class CardGame extends Phaser.Scene {
    constructor(config) {
        // console.log("cardGame constructor")

        super(config);

        this.cards = [];
        this.values = [];

        this.shuffledValues = [];
        this.selectedCards = [];

        this.cardAmount = 6;
        this.cardOriginalPos = {};
        this.depth = 0;
        this.cardToFlip = false;

        this.validateButton = null;
        this.winLoseIndicator = null;

        this.halfW = window.innerWidth/2;
        this.halfH = window.innerHeight/2;

        this.fourthW = window.innerWidth/4;
        this.fourthH = window.innerHeight/4;

        this.heightW = window.innerWidth/8;
        this.heightH = window.innerHeight/8;

        // Aspect ratio of card 19/14 -> 1.36
        this.cardDims = {frameWidth: window.innerWidth/8, frameHeight: (window.innerWidth/8) * 1.6};

        this.fillColor = 0xEC3858;
        this.highLightColor = 0x7FD3F5;
    }

    init(data) {}

    preload () {
    }

    create (data)  {
        let bg  = this.add.rectangle(this.halfW, this.halfW, window.innerWidth, window.innerHeight*3, 0xffffff);

        for (let i = 0; i < 100; i++) {
            this.values.push(i)
        }

        this.shuffledValues = this.values.splice(0, this.cardAmount).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
        this.selectedCards = []

        // console.log(this.shuffledValues)

        for (let i = 0; i < this.cardAmount; i++) {
            let posX = this.halfW
            let posY = this.heightH + i * this.heightH

            // let card = this.add.rectangle(posX, posY, this.cardDims.frameWidth, this.cardDims.frameHeight, this.fillColor);
            // scene, x, y, width, height, radiusConfig, fillColor, fillAlpha
            let card = new RoundRectangle(this, posX, posY, this.cardDims.frameWidth, this.cardDims.frameHeight, 5, this.fillColor, 1)
            this.add.existing(card);

            card.angle = 90
            card.value = this.shuffledValues[i]
            card.index = i
            this.bindCardEvents.call(this, card);
            this.cards.push(card)
        }

        // console.log(this.cards.map((card) => card.value))

        this.validateButton = this.add.text(this.fourthW, (this.cardAmount + 1) * this.heightH, 'Valider', { fill: '#000' })
            .setInteractive()
            .on('pointerdown', () => this.validate() )
        // .on('pointerover', () => this.enterButtonHoverState() )
        // .on('pointerout', () => this.enterButtonRestState() );

        this.winLoseIndicator = this.add.text(this.fourthW, (this.cardAmount + 1) * this.heightH + 30, '', { fill: '#000' })
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
                    this.cardToFlip = card2
                } else if(card1.value < card2.value) {
                    card1.setFillStyle(this.highLightColor)
                    this.cardToFlip = card1
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
            this.cards[i].y = this.heightH + i * this.heightH
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

        this.winLoseIndicator.setText(won ? "win, congratz" : "lost :/")
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
}
