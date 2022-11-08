
const template = document.createElement('template');

template.innerHTML = `
<style>
    .wai-day-summary-wrapper {
        background-color: white;
        border: 2px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        width: 10em;
    }
    .wai-day-summary-heading {
        font-weight:bold;
        text-align: center;
        font-size: 120%;
    }
    .wai-day-summary-btn {
        font-weight:bold;
        margin-top:10px;
    }
    .wai-day-summary-lbl {
       margin:10px;
    }

    .wai-day-summary-wrapper span {
        font-weight:bold;
    }

    .wai-day-close { 
        position: absolute;
        right: 5px;
        top: 5px;
        margin: 0;
        border: 0;
        background-color: white;
    }

    .right-btns {
        float: right;
    }
    .left-btns {
        float: left;
    }
    .btn-wrap {
        padding: 7px;
        padding-top: 0;
        height: 2em;
    }

    .hide {
        display: none;
    }
</style>
<div class="wai-day-summary-wrapper hide">
    <div class="wai-day-summary-heading">Hello</div>
    <button class="wai-day-close wai-day-summary-btn">X</button>
    <div class="btn-wrap">
        <span class="left-btns">
            <button class="wai-day-first wai-day-summary-btn">&lt;&lt;</button>
            <button class="wai-day-previous wai-day-summary-btn">&lt;</button>
        </span>
        <span class="right-btns">
            <button class="wai-day-next wai-day-summary-btn">&gt;</button>
            <button class="wai-day-last wai-day-summary-btn">&gt;&gt;</button>
        </span>
    </div>
</div>
`;

customElements.define('wai-day-summary', class WaiDaySummary extends HTMLElement {

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


        this.$(".wai-day-close").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("cancel", {
                detail: {cancel: true}
            }));
        });

        this.$(".wai-day-first").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("first", {
                detail: this._data
            }));
        });

        this.$(".wai-day-previous").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("previous", {
                detail: this._data
            }));
        });

        this.$(".wai-day-next").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("next", {
                detail: this._data
            }));
        });

        this.$(".wai-day-last").addEventListener("click", event => {
            this.dispatchEvent(new CustomEvent("last", {
                detail: this._data
            }));
        });
    }

    set data(data) {
        this._data = data;
        let element = this.$(".wai-day-summary-wrapper")
        if (data) {
            element.classList.remove("hide");
            let title = this.$(".wai-day-summary-heading");
            let date = data.date;
            title.innerHTML = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        } else {
            element.classList.add("hide");
        }
    }

    _hasnext(value) {
        this._disabler(value, ".right-btns button");
    }

    _hasprevious(value) {
        this._disabler(value, ".left-btns button");
    }

    _disabler(value, selector) {
        let elements = this.$$(selector);
        let state = value !== "true"; 
        elements.forEach(el => el.disabled = state)
        console.log("Nxt", elements.length)
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr](newValue);
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

});
