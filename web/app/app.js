import Map from "./map.js";
import config from "./config.js";
import Jobs from "./jobs.js";
import Tracker from "./tracker.js";

let mapManager = new Map(config.map);
mapManager.create();

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
/*
let features = new Features(config.featuresUrl);
features.show(map.map).then(l => {
   window.l = l;
});

let controls = new Controls(config.controls);
let jobs = new Jobs(config.jobs);

jobs.list().then(list => {
   controls.state.jobs = list;
});
*/
