import Map from "../app/map.js";
import Menu from "../app/menu.js";
import config from "./config.js";
import Point from "./point.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();

let position = new Position();
map.addControl(position);

let point = new Point(config.url, mapManager.map);

point.run();

let waiPanel = document.querySelector("wai-panel");
let waiMenu = document.querySelector("wai-menu");


let menu = new Menu(waiMenu, config.menu);

document.addEventListener("position", (ev) => {
    let properties = ev.detail.properties;
    waiPanel.innerHTML = "<a href='plots.html?job=" + properties.job_id + "'>" + properties.name + "</a>";
});
