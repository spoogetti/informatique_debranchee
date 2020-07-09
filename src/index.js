import Phaser from "phaser";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/main.css';

import ReconnectGame from "../lib/ReconnectGame";

document.querySelector("#startGameBtn").addEventListener("click", () => {
  let pseudo = document.querySelector("#pseudo").value;
  document.querySelector("#loginView").remove();
  launchGame(pseudo)
})

const launchGame = (pseudo) => {

  let margins = 200
  // setup container
  document.querySelector("#app").style.width = window.innerWidth + "px"
  document.querySelector("#app").style.height = window.innerHeight + margins + "px"
  document.querySelector("#app").style.overflow = "scroll"

  const config = {
    scale: {
      parent: "app",
      width: window.innerWidth,
      height: window.innerHeight + margins,
      mode: Phaser.Scale.ENVELOP,
    },
    scene: {
      preload: preload,
      create: create
    }
  };
  
  var game = new ReconnectGame(config)

  function preload() {
    this.load.svg("lock", '../lib/assets/lock.svg')
  }
  
  function create() {
    game.createMap();
    game.configurePlayer(pseudo)
  }
}