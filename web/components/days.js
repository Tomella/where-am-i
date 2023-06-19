const template = document.createElement('template');

template.innerHTML = `
<style>
button {
    width: 36px;
    height: 36px;
    padding: 0;
}

button.active {
    background-color: white;
}
</style>
<button id="wai-days">
<?xml
version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 3 1 L 3 2 L 2.5 2 C 1.6774686 2 1 2.6774686 1 3.5 L 1 12.5 C 1 13.322531 1.6774686 14 2.5 14 L 12.5 14 C 13.322531 14 14 13.322531 14 12.5 L 14 3.5 C 14 2.6774686 13.322531 2 12.5 2 L 12 2 L 12 1 L 11 1 L 11 2 L 4 2 L 4 1 L 3 1 z M 2.5 3 L 3 3 L 3 4 L 4 4 L 4 3 L 11 3 L 11 4 L 12 4 L 12 3 L 12.5 3 C 12.781469 3 13 3.2185314 13 3.5 L 13 5 L 2 5 L 2 3.5 C 2 3.2185314 2.2185314 3 2.5 3 z M 2 6 L 13 6 L 13 12.5 C 13 12.781469 12.781469 13 12.5 13 L 2.5 13 C 2.2185314 13 2 12.781469 2 12.5 L 2 6 z M 4 7 L 4 8 L 5 8 L 5 12 L 6 12 L 6 8 L 7 8 L 7 7 L 4 7 z M 8 7 L 8 10.5 C 8 11.189735 8.5193835 11.685623 9.1582031 11.857422 A 0.50005 0.50005 0 0 0 9.5 12 C 10.322531 12 11 11.322531 11 10.5 L 11 7 L 10 7 L 10 10.5 C 10 10.781469 9.7814686 11 9.5 11 C 9.2185314 11 9 10.781469 9 10.5 L 9 7 L 8 7 z"/>
</svg>

</button>
`;

class WaiDays extends HTMLElement {

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));

        this.$("#wai-days").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("next", {
                detail: this._data
            }));
        });
    }

    set active(value) {
        this._active = value;
        let button = this.$("button").classList; 
        if(value) {
            button.add("active");
        } else {
            button.remove("active");
        }
    }

    get active() {
        return this._active;
    }
}

customElements.define('wai-days', WaiDays);

export default  WaiDays;