import Phaser from "phaser";

const config = {
  parent: "phaserGame",
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    create: create
  },
};

let game = new Phaser.Game(config);
let text;

function create() {
  this.scene.visible = false
  text = this.add.text(window.innerWidth/2, window.innerHeight/2, "Info débranché", {
    font: "65px Arial",
    fill: "#ffffff",
    align: "center"
  });

  text.setOrigin(.5, .5)
}

