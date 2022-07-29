
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
 .disable {
   pointer-events: none;
   color:gray;
 }

 .extra_detail {
   margin-left: 15px;
   border: 1px solid gray;
   margin-right: 10px;
   padding-left: 5px;
   border-radius: 3px;
 }
</style>
<div>
   <button>+</button><span name="name"></span>
   <a href="javascript: return false" title="View where the last few point for this job. Hover over points for datestamp.">[track]</a>
</div>
<div hidden="hidden" class="extra_detail">
   Dates: <span class="start_date"></span> to <span class="last_date"></span><br/>
   Latitude:<br/>
   &nbsp;&nbsp;Min: <span class="miny"></span>&deg;<br/>
   &nbsp;&nbsp;Max: <span class="maxy"></span>&deg;<br/>
   Longitude: <br/>
   &nbsp;&nbsp;Min: <span class="minx"></span>&deg;<br/>
   &nbsp;&nbsp;Max: <span class="maxx"></span>&deg;<br/>
   Total points: <span class="points"></span>
</div>
`;

customElements.define('gps-job', class GpsJob extends HTMLElement {
   static get observedAttributes() { return ['data']; }

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
      button.addEventListener('click', (e) => {
         let selected = button.innerHTML === "+";
         button.innerHTML = selected ? "-" : "+";
         if(selected) {
            this.$(".extra_detail").removeAttribute("hidden");
         } else {
            this.$(".extra_detail").setAttribute("hidden", "hidden");
         }

      });
      let a = this.$("a");
      a.addEventListener('click', (e) => {
         if(this._disabled === "disabled") {
            return;
         }

         let selected = a.innerText !== "[track]";
         a.innerHTML = selected ? "[track]" : "[stop tracking]";

         this.dispatchEvent(new CustomEvent("jobtrack", {
            composed: true,
            bubbles: true,
            detail: {name: this._job.name, track: !selected, target: this}
         }));
      });
   }


   /*
   id: 1
last_date: "2020-02-19T02:34:44.000Z"
maxx: 138.83118675
maxy: -34.42501624
minx: 138.58872573
miny: -34.91469671
name: "Walking"
owner_id: 1
points: 38454
start_date: "2019-10-26T11:07:39.000Z"
   */
   set job(value) {
      this._job = value;
      let startDate = new Date(value.start_date);
      let lastDate = new Date(value.last_date);
      value.selected = false;
      this.$("[name=name").innerText = value.name;
      this.$(".points").innerText  = value.points.toLocaleString("en-AU");
      this.$(".minx").innerText  = value.minx.toFixed(5);
      this.$(".maxx").innerText  = value.maxx.toFixed(5);
      this.$(".miny").innerText  = value.miny.toFixed(5);
      this.$(".maxy").innerText  = value.maxy.toFixed(5);
      this.$(".start_date").innerText  = startDate.toLocaleDateString();
      this.$(".last_date").innerText  = lastDate.toLocaleDateString();
   }

   get job() {
      return this._job;
   }

   set disabled(value) {
      let classList = this.$("a").classList;
      if(value === "disabled") {
         classList.add("disable");
      } else {
         classList.remove("disable");
      }
      this._disabled = value;
   } 

   activate() {
      let a = this.$("a");
      a.click();
   }
});
