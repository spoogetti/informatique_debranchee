
const albert = {

    speed: 25,
    animationWakeDuration: 800, 
    HTMLContainer: () => document.querySelector("#albert"),
    HTMLBtn: () => albert.HTMLContainer().querySelector(".speech-btn"),

    start(callback=()=>{}) {
        this.HTMLBtn().addEventListener("click", () => {
            this.clear()
        })

        this.wake();
        setTimeout(() => {
            callback()
        }, this.animationWakeDuration)
    },

    wake() {
        this.HTMLContainer().classList.remove("d-none")
        this.HTMLContainer().classList.replace("sleep", "wake")
    },

    sleep() {
        this.HTMLContainer().classList.replace("wake", "sleep")
        setTimeout(() => {
            this.HTMLContainer().classList.add("d-none")
        }, 400)
    },

    talk(content, callback=()=>{}) {
        var i = 0;

        this.HTMLBtn().classList.add("d-none")
        typeWriter();

        function typeWriter() {
            if (i < content.length) {
                document.getElementById("about-text").innerHTML += content.charAt(i);
                i++;
                setTimeout(typeWriter, albert.speed);
            } else {
                albert.HTMLBtn().classList.remove("d-none")
                callback()
            }
        }
    },

    clear() {
        document.getElementById("about-text").innerHTML = ""
    },

    closeButton(content="Ok") {
        this.HTMLBtn().innerHTML = content
        this.HTMLBtn().addEventListener("click", () => {
            this.sleep();
        })
    },

    onsubmit(callback=()=>{}) {
        let _tempbtn = this.HTMLBtn().cloneNode()
        // remove to remove all event listenners binded
        this.HTMLBtn().remove()
        this.HTMLContainer().append(_tempbtn)
        this.HTMLBtn().innerHTML = "Ok"
        this.HTMLBtn().addEventListener("click", () => {
            callback()
        })
    },

    levelMode() {
        this.HTMLContainer().classList.add("level")
    },

    defaultMode() {
        this.HTMLContainer().classList.remove("level")
    }
}

export default albert