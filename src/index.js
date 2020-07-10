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
import dialogs from "./dialogs";

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
      document.querySelector("body").classList.add("overflow-hidden")
      document.querySelector("#reward").innerHTML = e.detail.level.reward
      document.querySelector("#level").innerHTML = game.player.level
      document.querySelector(".game-name").innerHTML = e.detail.level.displayName

      albert.levelMode()
      albert.wake()

      let text;
      switch(e.detail.level.name) {
        case "cardGame":
          text = "Positionne les cartes de la plus petite à la plus grande. La plus petite doit être placée en haut et la plus grande en bas. Touche deux cartes et je t'indiquerais la plus petite des deux."
          break;
        case "crepeGame":
          text = "Empile les bâtonnets du plus petit au plus grand. Aide toi pour cela de la flèche  pour retourner le paquet qui se trouve au-dessus."
          break;
        default:
          text= "Je ne connais pas ce niveau"
      }
      albert.talk(text)
    })

    game.canvas.addEventListener("reconnect-level-guess", (e) => {
      let lvl = e.detail.level
      let won = e.detail.won

      if(won) {
        game.player.level = lvl.levelGain
        albert.wake()
        albert.talk("Bravo, tu as gagné !", () => {
          albert.onsubmit(() => {
            window.scroll(0, window.innerHeight)
            lvl.scene.stop(lvl.key)
            game.availablePipes += lvl.reward
            game.backToMap()
            albert.defaultMode()
            albert.sleep()
            //reset albert default
            albert.onsubmit(() => {
              albert.sleep()
            })
          })
          albert.HTMLBtn().innerHTML = "Retourner à la carte"
        })
      } else {
        albert.wake()
        let rand = Math.floor(Math.random() * dialogs.wrongGuess.length - 1)  
        albert.talk(dialogs.wrongGuess[rand], () => {
          albert.HTMLBtn().innerHTML = "Réessayer"
        })
      }
    })

    game.canvas.addEventListener("reconnect-game-backToMap", () => {
      document.querySelector("#cardGame").classList.add("d-none")
      document.querySelector("#app").classList.remove("clip-cardGame")
      document.querySelector("body").classList.remove("overflow-hidden")
      header.show()
      header.update(game.availablePipes, game.player.level)
    })
  }

  document.querySelector(".game-backmap").addEventListener("click", () => {
    if(game.currentGame) {
      window.scroll(0, window.innerHeight)
      game.currentGame.scene.stop(game.currentGame.key)
      game.backToMap()
      albert.defaultMode()
    }
  })
};
