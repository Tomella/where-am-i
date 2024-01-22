import config from "./config.js";
import DateHelper from "../lib/datehelper.js";
import Display from "./display.js";
import Elevation from "../lib/elevation.js";
import Jobs from "../lib/jobs.js";
import Map from "../app/map.js";
import Menu from "../app/menu.js";
import Plotter from "./plotter.js";
import Position from "../lib/position.js";
import SummaryTransform from "../lib/summarytransform.js";
import Transformer from "./transformer.js";
import decorateSpeed from "../lib/speed.js";


let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;
let jobs = new Jobs(config.jobs);
let jobsList = await jobs.list();
let plotter = new Plotter(config.plotter, map);

let display = new Display(config, mapManager.map);
let waiGraph = document.querySelector("wai-graph");
let waiDaySummary = document.querySelector("wai-day-summary");
let waiMenu = document.querySelector("wai-menu");

let menu = new Menu(waiMenu, config.menu);

let heightGraph = null;
let heightGraphExpanded = true;

config.heightGraph.expandCallback = (expanded) => {
    heightGraphExpanded = expanded;
}


let data = await display.fetch();
console.log(SummaryTransform.daysToMonths(data))
console.log(SummaryTransform.daysToSeasons(data))
let maxDate = "0000-00-00";
let minDate = "2222-00-00";

Object.keys(data).forEach(name => {
    if(name < minDate) minDate = name;
    if(name > maxDate) maxDate = name;
});
waiGraph.data = data;

let changeDate = async (ev) => {
    changeDateHandler(ev.detail)
}

let changeDateHandler = async (date) => {
    // Change the url so a change of date can be book marked
    let dateStr = DateHelper.reverseGregorian(date);
    const url = new URL(window.location);
    url.searchParams.set('date', dateStr);
    window.history.pushState(null, '', url.toString());

    let response = await fetch(config.dateUrl.replace("$year", date.getFullYear()).replace("$month", date.getMonth() + 1).replace("$date", date.getDate()));
    
    let json = await response.json();

    decorateSpeed(json.features);

    plotter.show(json);

    if (heightGraph) {
        heightGraph.remove();
    }

    waiDaySummary.data = null;

    if (json && json.features && json.features.length) {
        let heightGraphConfig = config.heightGraph;
        heightGraphConfig.expand = heightGraphExpanded;

        heightGraph = L.control.heightgraph(heightGraphConfig);
        heightGraph.addTo(map);
        heightGraph.addData(Transformer.pointsToLinestring(json));
        waiDaySummary.data = {
            date
        };

        let reverseGregorianDate = DateHelper.reverseGregorian(date)
        waiDaySummary.setAttribute("hasnext", maxDate > reverseGregorianDate);
        waiDaySummary.setAttribute("hasprevious", minDate < reverseGregorianDate);
    }
}

let showFirst = (ev) => {
    changeDateHandler(new Date(minDate));
}

let showNext = (ev) => {
    let current = DateHelper.reverseGregorian(ev.detail.date);
    
    let result = Object.keys(data).find(key => key > current);
    console.log("<next> Current, next:", current, result);
    changeDateHandler(new Date(result));
}

let showPrevious = (ev) => {
    let current = DateHelper.reverseGregorian(ev.detail.date);
    
    let result = Object.keys(data).reverse().find(key => key < current);
    console.log("<previous> Current, next:", current, result);
    changeDateHandler(new Date(result));
}

let showLast = (ev) => {
    changeDateHandler(new Date(maxDate));
}

let clearDate = () => {
    if (heightGraph) {
        heightGraph.remove();
    }
    plotter.show(null);
    waiDaySummary.data = null;
}

waiGraph.addEventListener("selectdate", changeDate);
waiGraph.addEventListener("preview", preview);

let boundingBox = null;
async function preview(ev) {
    if(boundingBox) {
        boundingBox.remove();
    }
    
    let show = ev.detail;
    let version = 0;
    if(show) {
        version++;

        let localVersion = version;
        let dateStr = DateHelper.reverseGregorian(show.date);
        let dateData = data[dateStr];
        if(dateData) {
            var bounds = [[dateData.minlat, dateData.minlng], [dateData.maxlat, dateData.maxlng]];
            // create an orange rectangle
            boundingBox = L.rectangle(bounds, {color: "#ff7878", weight: 6});
            map.addLayer(boundingBox);
            
            let matches = await jobs.find(dateStr);
            if(localVersion == version) {
                show.target.innerHTML = matches.map(el => el.job.name).join("<br/>")
            }
        }
    }
}

waiDaySummary.addEventListener("cancel", clearDate);
waiDaySummary.addEventListener("first", showFirst);
waiDaySummary.addEventListener("previous", showPrevious);
waiDaySummary.addEventListener("next", showNext);
waiDaySummary.addEventListener("last", showLast);


// We want to listen for a click on the map (but not while the measuring tool is active)
let elevation = new Elevation(map, config.elevation);
mapManager.on("measure-toggle", evt => {
    elevation.enable = !evt.detail.enabled;
});

let position = new Position();
map.addControl(position);


let params = new URLSearchParams(document.location.search.substring(1));
let date = params.get("date");
if(date) {
    changeDateHandler(new Date(date));
}
