import Phaser from "phaser";

const config = {
  parent: "app",
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    create: create
  }
};

// var game = new Phaser.Game(config);
var text;

function create() {
  text = this.add.text(window.innerWidth/2, window.innerHeight/2, "Info débranché", {
    font: "65px Arial",
    fill: "#ffffff",
    align: "center"
  });

  text.setOrigin(.5, .5)
}

