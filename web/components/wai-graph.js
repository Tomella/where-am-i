const template = document.createElement('template');

template.innerHTML = `
<style>
.control {
   z-index: 90;
   position: absolute;
   bottom: 210px;
   right: 15px;
   padding: 5px;
   cursor: pointer;
   font-size: 110%;
   font-weight: bold; 
   role="button"
}

.control-show {
    z-index: 90;
    position: absolute;
    bottom: 20px;
    right: 10px;
    padding: 3px 8px 3px 8px;
    cursor: pointer;
    font-size: 120%;
    font-weight: bold; 
    background-color: rgb(255, 255, 255, 0.8);
    box-shadow: 0 1px 7px rgb(0 0 0 / 40%);
    border-radius: 5px;
 }
 
.container {
    z-index: 30;
    position: fixed;
    bottom: 20px;
    right:10px;
    height: 220px;
    left: 10px;
    background-color: rgb(255, 255, 255, 0.8);
    border-radius: 8px;
}
.hide {
    display: none;
}

.tooltip {
    z-index: 31;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 6em;
}


</style>
<div class="container"></div>
<span class="control" title="Hide graph of points per day." role="button">X</span>
<span class="control-show hide" title="Show graph of points per day." role="button">&lt;</span>
<span class="tooltip hide"></span>
`;

customElements.define('wai-graph', class GraphElement extends HTMLElement {

    #data = null;

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

        this.$(".control").addEventListener("click", event => {
            this.$(".container").classList.add("hide");
            this.$(".control").classList.add("hide");
            this.$(".control-show").classList.remove("hide");
        });

        this.$(".control-show").addEventListener("click", event => {
            this.$(".container").classList.remove("hide");
            this.$(".control").classList.remove("hide");
            this.$(".control-show").classList.add("hide");
        });
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

    set data(values) {
        let min = "9999-00-00"
        let max = "0000-00-00";

        let data = Object.keys(values).forEach((date) => {
            min = min < date ? min : date;
            max = max > date ? max : date;
        });

        // We want the date past the last date.
        let date = new Date(max);
        date.setDate(date.getDate() + 1);
        max = reverseGregorian(date);

        let result = [];
        let it = dater(min, max);
        let entry = it.next();
        while (!entry.done) {
            let realData = values[entry.value];
            result.push({ date: entry.value, value: (realData && realData.total) ? realData.total : 0 });
            entry = it.next();
        }

        this.#data = result;

        let container = this.$(".container");

        container.removeAttribute("hidden");
        this.render();

    }

    render() {
        let dateRange = this.dateRange = {};
        let lastXScale = null;

        let endZoom = ev => {
            const transform = ev.transform;
            lastXScale = transform.rescaleX(x);
            const domain = lastXScale.domain();
            dateRange.start = reverseGregorian(domain[0]);
            dateRange.end = reverseGregorian(domain[1]);


            this.dispatchEvent(new CustomEvent('changedates', { detail: dateRange }));
        }

        const div = this.$(".container");
        const data = this.#data;
        const height = div.clientHeight;
        const width = div.clientWidth;
        const margin = { top: 20, right: 10, bottom: 30, left: 40 };

        const zoom = d3.zoom()
            .scaleExtent([1, 54])
            .extent([[margin.left, 0], [width - margin.right, height]])
            .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
            .on("zoom", zoomed).on("end", endZoom);

        function zoomed(event) {
            const xz = event.transform.rescaleX(x);
            path.attr("d", area(data, xz));
            let r = gx.call(xAxis, xz);
        }

        const svg = d3.select(div).append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const clip = uid("clip");

        svg.append("clipPath")
            .attr("id", clip.id)
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);

        let x = lastXScale = d3.scaleUtc()
            .domain(d3.extent(data, d => new Date(d.date + "T00:00:00")))
            .range([margin.left, width - margin.right]);

        let y = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);


        let area = (data, x) => d3.area()
            .curve(d3.curveStepAfter)
            .x(d => x(new Date(d.date)))
            .y0(y(0))
            .y1(d => y(d.value))(data);

        let xAxis = (g, x) => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const path = svg.append("path")
            .attr("clip-path", clip)
            .attr("fill", "steelblue")
            .attr("d", area(data, x));

        const gx = svg.append("g")
            .call(xAxis, x);

        dateRange.start = x.domain()[0];
        dateRange.end = x.domain()[1];

        svg.append("g")
            .call(yAxis);

        svg.call(zoom)
            .transition()
            .duration(750);

        let tip = this.$(".tooltip")
        let mouseleave = () => {
            tip.classList.add("hide");
            tip.innerHTML = "";
            this.dispatchEvent(new CustomEvent("preview", { detail: null }));
        }

        let lastHoverDate = null;
        let mousemove = (ev) => {
            if (lastXScale) {
                let date = lastXScale.invert(ev.layerX);
                let hoverDate = reverseGregorian(date);
                let isNew = lastHoverDate != hoverDate;
                lastHoverDate = hoverDate;
                if (isNew) {
                    this.dispatchEvent(new CustomEvent('preview', { detail: date }));
                    tip.classList.remove("hide");
                    tip.innerHTML = hoverDate.split("-").reverse().join("/");
                    tip.style.left = (ev.x * 0.95) + "px";
                    tip.style.top = (ev.y - 40) + "px"
                }

            } else {
                tip.classList.add("hide");
            }
        }

        let lastClickDate = null;
        svg.on("click", ev => {
            let date = lastXScale.invert(ev.layerX);
            let reverseDate = reverseGregorian(date);
            if (reverseDate != lastClickDate) this.dispatchEvent(new CustomEvent('selectdate', { detail: date }));
            lastClickDate = reverseDate;
        }).on("mousemove", mousemove).on("mouseleave", mouseleave);

        // Define the div for the tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        return svg.node();
    }
});

function reverseGregorian(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, 0) + "-" +
        String(date.getDate()).padStart(2, 0);
}

function* dater(start, end) {
    let startDate = new Date(start);
    let endStr = end;

    let current = reverseGregorian(startDate);

    while (current <= endStr) {
        yield current;
        startDate.setDate(startDate.getDate() + 1);
        current = reverseGregorian(startDate);
    }
}

let ID = 0;
function uid(param) {
    ID++;
    return param + ID;
}
