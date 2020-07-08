import Phaser from "phaser";
import map from "./map";
import Pipe from "../lib/Pipe";

document.querySelector("#app").style.width = window.innerWidth + "px"
document.querySelector("#app").style.height = window.innerHeight + 1500 + "px"
document.querySelector("#app").style.overflow = "scroll"


const config = {
  scale: {
    parent: "app",
    width: window.innerWidth,
    height: window.innerHeight + 1500,
    mode: Phaser.Scale.ENVELOP,
  },
  scene: {
    create: create
  }
};



var game = new Phaser.Game(config);
var text;

function create() {
  text = this.add.text(window.innerWidth/2, window.innerHeight/2, "Info débranché", {
    font: "65px Arial",
    fill: "#ffffff",
    align: "center"
  });

  text.setOrigin(.5, .5)
  map.init(this);
}


