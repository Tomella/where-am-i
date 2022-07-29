
const template = document.createElement('template');

template.innerHTML = `
<style>
    .wai-dialog-heading {
        font-weight:bold;
        text-align: center;
        font-size: 130%;
    }
    .wai-dialog-btn {
        font-weight:bold;
        margin-top:10px;
    }
    .wai-dialog-lbl {
       margin:10px;
    }

    .wai-dialog-wrapper span {
        font-weight:bold;
    }
    .wai-dialog-wrapper {
        padding:10px;
    }
    .wai-end-date, .wai-start-date {
        width: 11em;
    }
</style>
<div class="wai-dialog-wrapper">
   <div class="wai-dialog-heading">Filter by Date</div>
   <div>
        <span>Start Date</span></br/>
        <input class="wai-start-date" type="date" min="1800-01-01"/><button class="wai-dialog-clear-btn">X</button>
    </div>
   <div>
        <span>End Date</span><br/>
        <input class="wai-end-date" type="date"/><button class="wai-dialog-clear-btn">X</button>
    </div>
   <button class="wai-dialog-btn">Apply</button>
</div>
`;

customElements.define('wai-dialog', class Dialog extends HTMLElement {

   static get observedAttributes() { return ['startdate', 'enddate']; }


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

      let endDateEl = this.$(".wai-end-date");
      let startDateEl = this.$(".wai-start-date");

      endDateEl.setAttribute("max", toReverseFregorian());

      let clears = this.$$(".wai-dialog-clear-btn");
      clears.forEach(element => {
         element.addEventListener("click", event => {
            let el = event.target.parentElement.querySelector("input");
            el.value = "";
         });
      });

      this.$(".wai-dialog-btn").addEventListener("click", event => {
         console.log("Button pressed");
         let startDate = startDateEl.value;
         let endDate = endDateEl.value;
         if (startDate && endDate) {
            if (startDate > endDate) {
               let temp = startDate;
               startDate = endDate;
               endDate = temp;
               startDateEl.value = startDate;
               endDateEl.value = endDate;
            }
         }
         this.dispatchEvent(new CustomEvent("change", {
            detail: {
               startDate: startDateEl.value,
               endDate: endDateEl.value
            }
         }));
      });
   }

   _startdate() {
      let value = this.getAttribute("startdate");
      let element = this.$(".wai-start-date");
      element.value = value;
   }

   _enddate() {
      let value = this.getAttribute("enddate");
      let element = this.$(".wai-end-date");
      element.value = value;
   }

   attributeChangedCallback(attr, oldValue, newValue) {
      this["_" + attr]();
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

});

function toReverseFregorian(when = new Date()) {
   return when.getFullYear() +
      '-' + `${when.getMonth() + 1}`.padStart(2, "0") +
      '-' + `${when.getDate()}`.padStart(2, "0");
};