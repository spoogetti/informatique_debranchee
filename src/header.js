const header = {

    HTMLContainer: () => document.querySelector("#header"),
    HTMLLevel: () => header.HTMLContainer().querySelector("#level"),
    HTMLPipe: () => header.HTMLContainer().querySelector("#pipe"),

    show() {
        this.HTMLContainer().classList.remove("d-none")
    },

    hide() {
        this.HTMLContainer().classList.add("d-none")
    },

    update(pipe, level) {
        this.HTMLLevel().innerHTML = level
        this.HTMLPipe().innerHTML = pipe
    }
}

export default header