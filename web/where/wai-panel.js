
const template = document.createElement('template');
template.innerHTML = `
<style>
div {
    font-size: 120%;
    padding: 20px;
    background-color: white;
    border: 2px solid #cccccc;
    background-clip: padding-box;
    border-radius: 6px;
    box-shadow: 2px 2px 8px #888888;
}
</style>
<div><slot></slot></div>
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
});
