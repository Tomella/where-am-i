import Map from "../app/map.js";
import config from "./config.js";
import Display from "./display.js";

let mapManager = new Map(config.map);
mapManager.create();


let display = new Display(config, mapManager.map);
let waiGraph = document.querySelector("wai-graph");

let data = await display.fetch();

waiGraph.data = data;

