import Phaser from "phaser";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/main.css';
import './assets/styles/header.css';
import '@fortawesome/fontawesome-free/js/all'
import header from "./header"
import './assets/styles/home.css';
import './assets/styles/about.css';
import './assets/styles/card-game.css';
import './assets/styles/albert.css';

import ReconnectGame from "../lib/ReconnectGame";
import albert from "./albert";

document.querySelector("#startGameBtn").addEventListener("click", () => {
    let pseudo = document.querySelector("#pseudo").value;
    document.querySelector("#loginView").remove();
    launchGame(pseudo)
})

const launchGame = (pseudo) => {

  let margins = 200
  // setup container
  document.querySelector("#app").style.position = 'absolute'
  document.querySelector("#app").style.top = 0
  document.querySelector("#app").style.zIndex = 1
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
    header.show()
    header.update(game.availablePipes, game.player.level)

    albert.start(() => {
      albert.talk("Salut, moi c'est Albert ! Je suis là pour t'aider à reconnecter les câbles entre eux afin qu'internet se remette à fonctionner. Pour collecter des câbles, commence par cliquer sur le premier niveau", () => {
        albert.closeButton("C'est parti")
      })
    });

    // Bind events of game
    game.canvas.addEventListener("reconnect-game-placedPipe", () => {
      header.update(game.availablePipes, game.player.level)
      
      if(game.map.pipes.filter(p => !p.locked).length >= 1) {
        header.wifiMedium();
      }
    })

    game.canvas.addEventListener("reconnect-game-levelChoosed", (e) => {
      header.hide()
      document.querySelector("#cardGame").classList.remove("d-none")
      document.querySelector("#app").classList.add("clip-cardGame")
      document.querySelector("#reward").innerHTML = e.detail.level.reward

      albert.levelMode()
      albert.wake()
      albert.talk("Coucou les petits")
    })

    game.canvas.addEventListener("reconnect-game-backToMap", () => {
      document.querySelector("#cardGame").classList.add("d-none")
      document.querySelector("#app").classList.remove("clip-cardGame")
      header.show()
      header.update(game.availablePipes, game.player.level)
    })
  }
};
