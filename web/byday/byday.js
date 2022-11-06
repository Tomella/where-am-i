import config from "./config.js";

import Display from "./display.js";
import Map from "../app/map.js";
import Plotter from "./plotter.js";
import Transformer from "./transformer.js";

import DateHelper from "../lib/datehelper.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;

let plotter = new Plotter(config.plotter, map);

let display = new Display(config, mapManager.map);
let waiGraph = document.querySelector("wai-graph");
let waiDaySummary = document.querySelector("wai-day-summary");
let heightGraph = null;


let data = await display.fetch();
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
    let response = await fetch(config.dateUrl.replace("$year", date.getFullYear()).replace("$month", date.getMonth() + 1).replace("$date", date.getDate()));
    let json = await response.json();
    plotter.show(json);

    if (heightGraph) {
        heightGraph.remove();
    }

    waiDaySummary.data = null;

    if (json && json.features && json.features.length) {
        heightGraph = L.control.heightgraph({
            position: "topright"
        });
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
waiDaySummary.addEventListener("cancel", clearDate);
waiDaySummary.addEventListener("first", showFirst);
waiDaySummary.addEventListener("previous", showPrevious);
waiDaySummary.addEventListener("next", showNext);
waiDaySummary.addEventListener("last", showLast);


// We want to listen for a click on the map
map.on("click", async ev => {
    // console.log(ev.latlng);
    let url = config.elevationUrl.replace("$lat", ev.latlng.lat).replace("$lng", ev.latlng.lng);

    L.popup()
        .setLatLng(ev.latlng)
        .setContent("Fetching elevation...")
        .openOn(map);

    let response = await fetch(url);
    let elevation = await response.text();
    console.log("EL: " + elevation);

    L.popup()
        .setLatLng(ev.latlng)
        .setContent("<span title='Elevation above sea level.'>Elevation: " + elevation + 'm</span>')
        .openOn(map);
});

let position = new Position();
map.addControl(position);
