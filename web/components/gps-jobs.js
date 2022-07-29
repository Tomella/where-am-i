
const template = document.createElement('template')
template.innerHTML = `
<style>
   .gps-container {
      padding-top: 30px;
   }

   .gps-jobs-heading {
      position: absolute;
      top: 0px;
      text-align: center;
      margin-block-start: .7em;
      margin-block-end: .33em;
   }
   .gps-jobs-list {
   
   }
</style>
<div class="gps-container">
   <h3 class="gps-jobs-heading">Jobs</h3>
   <div class="gps-jobs-list"></div>
</div>
`;

customElements.define('gps-jobs', class GpsJobs extends HTMLElement {

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
      root.appendChild(template.content.cloneNode(true))
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   set jobs(jobs) {
      this._jobs= jobs;
      let target = this.$(".gps-jobs-list");
      target.innerHTML = "";
      if(jobs && jobs.length) {
         jobs.forEach(job => {
            let tag = document.createElement("gps-job");
            tag.job = job;
            target.appendChild(tag);
            tag.job = job;
         });
      }
   }

   get jobs() {
      return this._jobs;
   }

   get paths() {
      return this._paths;
   }

   set active(val) {
      let jobs = this.$$("gps-job");
      let job = Array.from(jobs).find(el => {
         return el.job.id === val;
      });

      if(job) {
         job.activate();
      }
   }

   set paths(paths) {
      this._paths = paths;
      console.log(paths);
   }

});
