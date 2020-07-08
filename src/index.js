import Phaser from "phaser";
import map from "./map";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/main.css';


document.querySelector("#startGameBtn").addEventListener("click", () => {
    let psuedo = document.querySelector("#pseudo").value;
    document.querySelector("#loginView").remove();
    launchMap()
})

const launchMap = () => {

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
            create: create
        }
    };

    var game = new Phaser.Game(config);

    function create() {
        map.init(this);
    }
}