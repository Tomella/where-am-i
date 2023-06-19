import "./days.js";
import "./months.js";
import "./seasons.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
span {
    padding: 0;
}
</style>
<span>
<wai-days></wai-days>
<wai-months></wai-months>
<wai-seasons></wai-seasons/>
</span>
`;

customElements.define('wai-periods', class WaiPeriods extends HTMLElement {

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));

        let days = this.$("wai-days");
        let months = this.$("wai-months");
        let seasons = this.$("wai-seasons");
        
        months.addEventListener("click", (ev) => {
            reactToPress(ev, "months");
        });
        
        seasons.addEventListener("click", (ev) => {
            reactToPress(ev, "seasons")
        });
        
        days.addEventListener("click", (ev) => {
            reactToPress(ev, "days")
        });

        var reactToPress = (ev, clue) => {
            let target = ev.target;
            if(!target.active) {
                clearActive();
                target.active = true;
            }

            const event = new CustomEvent('periodchange', { detail: {type: clue}});
            this.dispatchEvent(event)
            console.log("Event for ", clue);
        }

        function clearActive() {
            months.active = seasons.active = days.active = false;
        }
    }
});
