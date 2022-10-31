const template = document.createElement('template');
template.innerHTML = `
    <span></span>
`;

class Elevation extends HTMLElement {
    static get observedAttributes() { return ['duration', 'value']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }
}
customElements.define('elevation', GpsExtent);

export default Elevation;