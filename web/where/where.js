import Map from "../app/map.js";
import config from "./config.js";
import Point from "./point.js";

let mapManager = new Map(config.map);
mapManager.create();

let point = new Point(config.url, mapManager.map);

point.run();


let waiPanel = document.querySelector("wai-panel");

document.addEventListener("position", (ev) => {
    waiPanel.data = ev.detail;
});
