import Phaser from "phaser";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {cardGame} from './games/cardGame.js'
import {crepeGame} from './games/crepesGame.js'

cardGame();
// crepeGame();


// const config = {
//   parent: "phaserGame",
//   width: window.innerWidth,
//   height: window.innerHeight,
//   scene: {
//     create: create
//   },
// };
//
// let game = new Phaser.Game(config);
// let text;
//
// function create() {
//   this.scene.visible = false
//   text = this.add.text(window.innerWidth/2, window.innerHeight/2, "Info débranché", {
//     font: "65px Arial",
//     fill: "#ffffff",
//     align: "center"
//   });
//
//   text.setOrigin(.5, .5)
// }

