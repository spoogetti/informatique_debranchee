import Phaser from "phaser";

import levels from "./globals/levels"
import ReconnectMap from "./ReconnectMap"
import CardGame from "./games/cardGame";
import CrepeGame from "./games/crepeGame";


class ReconnectGame extends Phaser.Game {

    constructor(args){
        super(args)
        this.player = {}
        this.player.level = 1
        this.availablePipes = 2
        this.lvlPlayed = 0
    }

    configurePlayer(pseudo) {
        this.player.pseudo = pseudo
    }

    createMap() {
        this.mapScene = this.scene.scenes[0]
        this.drawBackground();

        let map = new ReconnectMap(this.mapScene, 0, 0, [])
        this.map = map;
        map.createTerrain();
        map.createLevels(levels);

        map.center()
        window.scrollTo(0, document.body.scrollHeight);
    }

    levelChoose(game) {
        window.scrollTo(0, 0);
        // this.scene.sleep(this.mapScene)

        switch(game) {
            case "cardGame":
                let cardGameScene = new CardGame({
                    key: 'cardGame' + this.lvlPlayed,
                })
                this.scene.add('cardGame' + this.lvlPlayed, cardGameScene, true)
                break;
            case "crepeGame":
                let crepeGameScene = new CrepeGame({
                    key: 'crepeGame' + this.lvlPlayed,
                })
                this.scene.add('crepeGame' + this.lvlPlayed, crepeGameScene, true)
                break;
            default:
                break;
        }

        this.lvlPlayed++
        
        let event = new CustomEvent("reconnect-game-levelChoosed", {
            detail: {
                level: game
            }
        })
        this.canvas.dispatchEvent(event)
    }

    drawBackground() {
        let { width, height } = this.mapScene.sys.game.canvas;

        let texture = this.mapScene.textures.createCanvas('gradient', width, height);
        let context = texture.getContext();
        let grd = context.createLinearGradient(0, 0, 0, height);
      
        grd.addColorStop(0, '#7FD3F5');
        grd.addColorStop("0.3", '#3E2AA1');
        grd.addColorStop(1, '#580FA7');

        context.fillStyle = grd;
        context.fillRect(0, 0, width, height);
      
        //  Call this if running under WebGL, or you'll see nothing change
        texture.refresh();
      
        let gradient = this.mapScene.add.image(width / 2, height / 2, 'gradient');
    }

    // actions to do when place a pipe
    placePipe(pipe) {
        this.availablePipes--
        let event = new CustomEvent("reconnect-game-placedPipe", {
            detail: {
                pipe: pipe
            }
        })
        this.canvas.dispatchEvent(event)
    }
}

export default ReconnectGame
