import Map from "../app/map.js";
import config from "./config.js";
import Display from "./display.js";
import Position from "../lib/position.js";


let mapManager = new Map(config.map);

mapManager.create();

let map = mapManager.map;

let display = new Display(config, mapManager.map);
let waiGraph = document.querySelector("wai-graph");

let data = await display.fetch();

waiGraph.data = data;

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
})


let position = new Position();
map.addControl(position);
