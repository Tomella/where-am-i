import config from "./config.js";
import Elevation from "../lib/elevation.js";
import Map from "../app/map.js";
import Menu from "../app/menu.js";
import Point from "./point.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;

let position = new Position();
map.addControl(position);

let point = new Point(config.url, mapManager.map);

point.run();

let waiPanel = document.querySelector("wai-panel");
let waiMenu = document.querySelector("wai-menu");


let menu = new Menu(waiMenu, config.menu);

document.addEventListener("position", (ev) => {
    let properties = ev.detail.properties;
    let dateStr = properties.time_point ? properties.time_point.substr(0, 10) : "";
    waiPanel.innerHTML = `<a href='byday.html?date=${properties.time_point.substr(0, 10)}' title='View all points on this date.'>${properties.name}</a>`;
});

let elevation = new Elevation(map, config.elevation);
mapManager.on("measure-toggle", evt => {
    elevation.enable = !evt.detail.enabled;
});