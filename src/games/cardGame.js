import Phaser from "phaser";

// import cards from '../assets/cards.png';
import fCards from '../assets/playingCards.png';

export let cardGame = function() {
    const cardSpriteDims = { frameWidth: 140, frameHeight: 190 }
    const margin = 3

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

    var game = new Phaser.Game(config);

    function preload() {
        // this.load.image("logo", logoImg);
        // card sprite sheet
        // this.load.image('cards', cards);
        // this.load.spritesheet('cards', cards, { frameWidth: 167, frameHeight: 243 });
        this.load.spritesheet('fancyCards', fCards, cardSpriteDims);
    }

    let cards = []
    let shuffledValues = []
    let values = []
    let cardOriginalPos = {}
    let selectedCards = []
    let hearts = []
    let cardAmount = 6
    let depth = 0
    let cardToFlip

    let validateButton
    let winLoseIndicator

    function create() {
        // Sample logo with tween
        // const logo = this.add.image(400, 150, 'logo');
        // this.tweens.add({
        //   targets: logo,
        //   y: 450,
        //   duration: 2000,
        //   ease: "Power2",
        //   yoyo: true,
        //   loop: -1
        // });

        hearts = [64, 23, 47, 38, 29, 20, 11, 2, 82, 73, 55, 46, 37]
        values = [0, 1, 2 , 3, 4, 5, 6, 7, 8, 9]
        for (let i = 99; i <=0; i--) {
            values.push(i)
            console.log(i)
        }

        shuffledValues = values.splice(0, cardAmount).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
        selectedCards = []

        // créer un group pour les delete en groupe ?

        for (let i = 0; i < cardAmount; i++) {
            let posX = cardSpriteDims.frameWidth/2 + margin + i * (cardSpriteDims.frameWidth + margin)
            let posY = cardSpriteDims.frameHeight/2 + margin
            let card = this.add.sprite(posX, posY,'fancyCards', 7);
            card.fliped = true
            card.frameId = hearts[shuffledValues[i]]
            card.value = shuffledValues[i]
            bindCardEvents.call(this, card);
            cards.push(card)
        }

        validateButton = this.add.text(200, 200, 'Victory check button', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => validate() )
            // .on('pointerover', () => this.enterButtonHoverState() )
            // .on('pointerout', () => this.enterButtonRestState() );

        winLoseIndicator = this.add.text(400, 200, '', { fill: '#0f0' })
    }

    function bindCardEvents(card) {
        // Hitbox
        let shape = new Phaser.Geom.Rectangle(0, 0, cardSpriteDims.frameWidth, cardSpriteDims.frameHeight);
        card.setInteractive(shape, Phaser.Geom.Rectangle.Contains);

        //  Input Event listeners
        card.on('pointerover', function () {
            card.setTint(0xd0d0d0);
        });

        card.on('pointerout', function () {
            if(selectedCards.length === 0 || selectedCards[0] !== card)
                card.clearTint();
            else if(selectedCards.length === 1 || selectedCards[0] === card) {
                card.setTint(0xa0a0a0);
            }
        });

        this.input.setDraggable(card);
        this.input.on('drag', function (pointer, card, dragX, dragY) {
            if(!card.dragging) {
                setCardOriginalPos(card.x, card.y)
                // console.log("setoriginalpos", cardOriginalPos)
                card.dragging = true;
            }

            card.setDepth(++depth)
            card.x = dragX;
            card.y = dragY;
        });

        card.on('pointerup', () => {
            // console.log('pointerup')
            if(cardToFlip) {
                cardToFlip.setFrame(7)
                cardToFlip = false
            }
            if(!card.dragging) {
                if(selectedCards[0] !== card) {
                    selectedCards.push(card)
                    card.setTint(0xa0a0a0);
                } else if (selectedCards.length === 1 && selectedCards[0] === card) {
                    selectedCards.pop()
                    card.clearTint()
                }
                // card.fliped = !card.fliped;
            } else {
                card.dragging = false;
                swapCards(cardOriginalPos, {"x": card.x, "y": card.y})
            }

            if(selectedCards.length === 2) {
                let card1 = selectedCards[0]
                let card2 = selectedCards[1]
                // console.log(card1.value, card2.value)

                if(card1.value > card2.value) {
                    card2.setFrame(card2.frameId)
                    cardToFlip = card2
                } else if(card1.value < card2.value) {
                    card1.setFrame(card1.frameId)
                    cardToFlip = card1
                }

                card1.clearTint()
                card2.clearTint()
                selectedCards = []
            }
        })
    }

    function swapCards(cardOriginalPos, cardNewPos) {
        // console.log(cardOriginalPos, cardNewPos, Math.floor(cardOriginalPos.x / cardSpriteDims.frameWidth), Math.floor(cardNewPos.x / cardSpriteDims.frameWidth))

        // Nouvelle position
        let newPos = Math.floor(cardNewPos.x / cardSpriteDims.frameWidth)
        newPos = newPos < 0 ? 0 : newPos
        newPos = newPos >= 6 ? 5 : newPos

        // Ancienne position
        let oldPos = Math.floor(cardOriginalPos.x/cardSpriteDims.frameWidth)

        // console.log(newPos !== oldPos, newPos < 6, newPos > 0)

        if(newPos !== oldPos && newPos < 6 && newPos >= 0) {
            // echange dans le tableau qui indique les frames
            // l'échange dans ce tableau à peu d'intérêt sachant que le tableau d'objets contient déjà la frame id
            let temp = shuffledValues[oldPos]
            shuffledValues[oldPos] = shuffledValues[newPos]
            shuffledValues[newPos] = temp

            // échange dans le tableau qui contient les objets
            let tempCard = cards[oldPos]
            cards[oldPos] = cards[newPos]
            cards[newPos] = tempCard
        }
        // console.log(oldPos, newPos)

        for (let i = 0; i < cardAmount; i++) {
            cards[i].x = cardSpriteDims.frameWidth/2 + margin + i * (cardSpriteDims.frameWidth + margin)
            cards[i].y = cardSpriteDims.frameHeight/2 + margin
            cards[i].frameId = hearts[cards[i].value]
        }
    }

    function setCardOriginalPos(posX, posY) {
        cardOriginalPos = {"x": posX, "y": posY}
    }

    function validate() {
        let arrayEntry = 0
        let won = true
        cards.forEach((card) => {
            if(card.value > arrayEntry) {
                won = false
                return
            }
            arrayEntry++
        })
        winLoseIndicator.setText(won ? "win, congratz" : "lost :/")
    }
}
