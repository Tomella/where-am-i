import Map from "../app/map.js";
import config from "./config.js";
import Display from "./display.js";

let mapManager = new Map(config.map);
mapManager.create();


let params = new URLSearchParams(document.location.search.substring(1));
let job = params.get("job");

let display = new Display(+job, config, mapManager.map);
let waiGraph = document.querySelector("wai-graph");


display.fetch();
// waiGraph.data = summary;

