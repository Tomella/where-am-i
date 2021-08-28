
const template = document.createElement('template');
template.innerHTML = `
<style>
button {
   padding: 4px;
   border: 2px;
   border-color: gray;
   border-radius: 2px;
   background-color: white;
   font-size: 1.5rem;
   width: 1em;
 }
 a {
    float: right;
    padding-right:12px;
 }
</style>
<div>
   <button >+</button>
   <slot name="name"></slot>
   <a href="javascript: return false" title="View where the last few point for this job. Hover over points for datestamp.">[track]</a>
</div>
`;

customElements.define('gps-job', class GpsJob extends HTMLElement {
   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      // Do something with the arguments
      super();
      // Normally you are adding the template
      const root = this.attachShadow({ mode: 'open' })
      root.appendChild(template.content.cloneNode(true))
   }

   connectedCallback() {
      let button = this.$("button");
      let text = this.innerText;
      button.addEventListener('click', (e) => {
         let selected = button.innerHTML === "+";
         button.innerHTML = selected ? "-" : "+";

         this.dispatchEvent(new CustomEvent("jobexpand", {
            composed: true,
            bubbles: true,
            detail: {name: text, expanded: selected}
         }));
      });
      let a = this.$("a");
      let aText = a.innerText;
      a.addEventListener('click', (e) => {
         let selected = a.innerText !== "[track]";
         a.innerHTML = selected ? "[track]" : "[stop tracking]";

         this.dispatchEvent(new CustomEvent("jobtrack", {
            composed: true,
            bubbles: true,
            detail: {name: text, track: !selected}
         }));
      });
   }

   set job(value) {
      this._job = value;
      value.selected = false;
      const slot = this.$('slot')
      const [node] = slot.assignedNodes();
      this.setAttribute('title', node.textContent)
   }

   get job() {
      return this._job;
   }

   activate() {
      let a = this.$("a");
      a.click();
   }
});
