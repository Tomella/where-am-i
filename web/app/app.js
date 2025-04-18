import Elevation from "../lib/elevation.js";
import Map from "./map.js";
import Menu from "../app/menu.js";
import config from "./config.js";
import Jobs from "../lib/jobs.js";
import Tracker from "./tracker.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();

let waiMenu = document.querySelector("wai-menu");
let menu = new Menu(waiMenu, config.menu);

let elevation = new Elevation(map, config.elevation);
mapManager.on("measure-toggle", evt => {
    elevation.enable = !evt.detail.enabled;
});

let position = new Position();
map.addControl(position);

let gpsjobs = document.querySelector("gps-jobs");

gpsjobs.addEventListener("jobexpand", (e) => {
   console.log("jobexpand", e);
});


let jobs = new Jobs(config.jobs);
let results = await jobs.list();
gpsjobs.jobs = results.reverse();


let tracker = new Tracker(config.tracker, mapManager.map);

gpsjobs.addEventListener("showextent", (e) => {
   tracker.extent(e.detail);
});

gpsjobs.addEventListener("jobtrack", async (e) => {
   e.detail.target.disabled = "disabled";
   try {
      await tracker[e.detail.track? "track": "stop"](e.detail.name);
   } finally {
      e.detail.target.disabled = "";
   }
});

let params = new URLSearchParams(document.location.search.substring(1));
let job = params.get("job");
if(job) {
   gpsjobs.active = +job;
}