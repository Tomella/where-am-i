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
<button id="wai-months">
<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 16 16">
    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 3 1 L 3 2 L 2.5 2 C 1.6774686 2 1 2.6774686 1 3.5 L 1 12.5 C 1 13.322531 1.6774686 14 2.5 14 L 12.5 14 C 13.322531 14 14 13.322531 14 12.5 L 14 3.5 C 14 2.6774686 13.322531 2 12.5 2 L 12 2 L 12 1 L 11 1 L 11 2 L 4 2 L 4 1 L 3 1 z M 2.5 3 L 3 3 L 3 4 L 4 4 L 4 3 L 11 3 L 11 4 L 12 4 L 12 3 L 12.5 3 C 12.781469 3 13 3.2185314 13 3.5 L 13 5 L 2 5 L 2 3.5 C 2 3.2185314 2.2185314 3 2.5 3 z M 2 6 L 13 6 L 13 12.5 C 13 12.781469 12.781469 13 12.5 13 L 2.5 13 C 2.2185314 13 2 12.781469 2 12.5 L 2 6 z M 5 7 L 5 12 L 6 12 L 6 7 L 5 7 z M 8.5 7 C 7.6774686 7 7 7.6774686 7 8.5 L 8 8.5 C 8 8.2185314 8.2185314 8 8.5 8 C 8.7814686 8 9 8.2185314 9 8.5 C 9 8.5235718 8.9272924 8.7776401 8.7597656 9.0546875 C 8.5922389 9.3317349 8.3541165 9.6511926 8.1132812 9.9453125 C 7.6316111 10.533552 7.1464844 11.021484 7.1464844 11.021484 L 7 11.167969 L 7 12 L 10 12 L 10 11 L 8.5078125 11 C 8.6716115 10.819007 8.6966336 10.810266 8.8867188 10.578125 C 9.1458835 10.26162 9.4077611 9.9153745 9.6152344 9.5722656 C 9.8227076 9.2291568 10 8.9089282 10 8.5 C 10 7.6774686 9.3225314 7 8.5 7 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/>
</svg>
</button>
`;

class WaiMonths extends HTMLElement {

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));

        this.$("#wai-months").addEventListener("click", event => {
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

customElements.define('wai-months', WaiMonths);

export default WaiMonths;