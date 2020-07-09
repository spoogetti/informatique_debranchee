import styles from "./styles"

const header = {

    HTMLContainer: () => document.querySelector("#header"),
    HTMLLevel: () => header.HTMLContainer().querySelector("#level"),
    HTMLPipe: () => header.HTMLContainer().querySelector("#pipe"),
    HTMLWifi: () => header.HTMLContainer().querySelector(".wifi"),

    show() {
        this.HTMLContainer().classList.remove("d-none")
    },

    hide() {
        this.HTMLContainer().classList.add("d-none")
    },

    update(pipe, level) {
        this.HTMLLevel().innerHTML = level
        this.HTMLPipe().innerHTML = pipe
    },

    wifiMedium() {
        this.HTMLWifi().style.color = styles.difficultiesColors.medium
    }
}

export default header