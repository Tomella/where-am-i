
const template = document.createElement('template');
template.innerHTML = `
<style>
div {
    font-size: 120%;
}
</style>
<div></div>
`;

customElements.define('wai-panel', class WaiPanel extends HTMLElement {
   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      // Do something with the arguments
      super();
      // Normally you are adding the template
      const root = this.attachShadow({ mode: 'open' })
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      this.target = this.$("div");
   }

   set data(value) {
       this._data = value;
       this.target.innerHTML = value.properties.name;
   }
});
