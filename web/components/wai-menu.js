
const template = document.createElement('template');

template.innerHTML = `
<style>
    .wai-menu-wrapper {
        background-color: white;
        border: 2px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        padding: 4px;
        padding-bottom: 0;
        width: 50px;
    }

    
</style>
<button class="wai-menu-wrapper" role="button">
    <?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
    <svg height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" 
        version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
</button>
`;

customElements.define('wai-menu', class WaiMenu extends HTMLElement {

    static get observedAttributes() { return ["hasnext", "hasprevious"]; }


    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    $$(selector) {
        return this.shadowRoot && this.shadowRoot.querySelectorAll(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));
        //let div = this.$("div");
        //div.innerHTML = this.innerHTML;


    }

    set data(data) {
        this._data = data;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr](newValue);
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

});
