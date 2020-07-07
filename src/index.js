// import Phaser from "phaser";
import cards from './assets/cards.png';
import fCards from './assets/playingCards.png';

//
// let config = {
//   type: Phaser.AUTO,
//   // parent: "phaser-example",
//   width: 500,
//   height: 500,
//   physics: {
//     default: 'arcade',
//     arcade: {
//       gravity: { y: 300 },
//       debug: true
//     }
//   },
//   scene: {
//     preload: preload,
//     create: create,
//     update: update
//   }
// };
//
// // global object with game options
// let gameOptions = {
//   // flipping speed in milliseconds
//   flipSpeed: 200,
//
//   // flipping zoom ratio. Simulates the card to be raised when flipping
//   flipZoom: 1.2
// }
//
// let game = new Phaser.Game(config);
// let card;
//
// function preload() {
//   // making the game cover the biggest window area possible while showing all content
//   // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//   // game.scale.pageAlignHorizontally = true;
//   // game.scale.pageAlignVertically = true;
//
//   // changing background colors
//   // game.stage.backgroundColor = 0x448844;
//
//   // card sprite sheet
//   this.load.spritesheet('cards', cards, { frameWidth: 167, frameHeight: 243 });
// }
//
// function create() {
//   // adding the card
//   card = this.physics.add.sprite(this.width / 2, this.height / 2, 'cards', 0);
//
//   // console.log(card)
//
//   // setting card anchor points to its center
//   // card.anchor.set(0.5);
//
//   // custom property to tell us if the card is flipping. It's not, at the moment.
//   // card.isFlipping = false;
//
//   // waiting for player input
//   // this.input.onDown.add(function(){
//
//   //   // if the card is not flipping...
//   //   if(!card.isFlipping){
//   //
//   //     // it's flipping now!
//   //     card.isFlipping = true;
//   //
//   //     // start the first of the two flipping animations
//   //     this.flipTween.start();
//   //   }
//   // }, this);
//
//
//   // // first tween: we raise and flip the card
//   // this.flipTween = this.add.tween(card.scale).to({
//   //   x: 0,
//   //   y: gameOptions.flipZoom
//   // }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
//   //
//   // // once the card is flipped, we change its frame and call the second tween
//   // this.flipTween.onComplete.add(function(){
//   //   card.frame = 1 - card.frame;
//   //   this.backFlipTween.start();
//   // }, this);
//   //
//   // // second tween: we complete the flip and lower the card
//   // this.backFlipTween = this.add.tween(card.scale).to({
//   //   x: 1,
//   //   y: 1
//   // }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
//   //
//   // // once the card has been placed down on the table, we can flip it again
//   // this.backFlipTween.onComplete.add(function(){
//   //   card.isFlipping = false;
//   // }, this);
// }
//
// function update ()
// {
//
// }
//

import Phaser from "phaser";
import logoImg from "./assets/logo.png";

const cardSpriteDims = { frameWidth: 140, frameHeight: 190 }
const margin = 3

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  backgroundColor: '#ffffff',
  // width: (cardSpriteDims.frameWidth + margin)*6 + margin,
  // height: cardSpriteDims.frameHeight + margin * 2,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {
  game.resize(window.innerWidth, window.innerHeight);
}, false);

function preload() {
  this.load.image("logo", logoImg);
  // card sprite sheet
  // this.load.image('cards', cards);
  this.load.spritesheet('cards', cards, { frameWidth: 167, frameHeight: 243 });
  this.load.spritesheet('fancyCards', fCards, cardSpriteDims);
}


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

  // const card = this.add.image(400, 150, 'cards');

  // console.log(this.width / 2, this.height / 2)

  // let cards = []
  //
  // for (let i = 0; i < 6; i++) {
  //   var card = this.add.sprite(90 + i * 170, 130,'cards', 0);
  //   bindCardEvents.call(this, card);
  //   cards.push(card)
  // }


  let cards = []
  let hearts = [64, 23, 47, 38, 29, 20, 11, 2, 82, 73, 55, 46, 37]
  let shuffledHearts = hearts.splice(0, 6).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
  let selectedCards = []

  for (let i = 0; i < 6; i++) {
    let posX = cardSpriteDims.frameWidth/2 + margin + i * (cardSpriteDims.frameWidth + margin)
    let posY = cardSpriteDims.frameHeight/2 + margin
    let card = this.add.sprite(posX, posY,'fancyCards', 7);
    card.fliped = true
    card.frameId = shuffledHearts[i]
    card.value = i
    bindCardEvents.call(this, card);
    cards.push(card)
  }


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
    card.clearTint();
  });

  // this.anims.create({
  //   key: 'flip-recto',
  //   frames: this.anims.generateFrameNumbers('fancyCards', {start: card.frameId, end: 7}),
  //   frameRate: 1000,
  //   repeat: 0
  // });

  // this.anims.create({
  //   key: 'flip-verso',
  //   frames: this.anims.generateFrameNumbers('fancyCards', {start: 7, end: card.frameId}),
  //   frameRate: 1000,
  //   repeat: 0
  // });

  this.input.setDraggable(card);
  this.input.on('drag', function (pointer, card, dragX, dragY) {
    card.x = dragX;
    card.y = dragY;
    card.preventPick = true
  });

  card.on('pointerup', () => {
    if(card.preventPick) {
      card.preventPick = !card.preventPick
    } else {
      card.setFrame(card.fliped? card.frameId : 7)
      card.fliped = !card.fliped;
    }
  })



}
