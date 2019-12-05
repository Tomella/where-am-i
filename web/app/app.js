import Map from "./map.js";
import config from "./config.js";
import Jobs from "./jobs.js";
import Tracker from "./Tracker.js";

let mapManager = new Map(config.map);
mapManager.create();

let gpsjobs = document.querySelector("gps-jobs");

gpsjobs.addEventListener("jobexpand", (e) => {
   console.log("jobexpand", e);
});

let jobs = new Jobs(config.jobs);
jobs.list().then(jobs => {
   gpsjobs.jobs = jobs;
});

let tracker = new Tracker(config.tracker, mapManager.map);

gpsjobs.addEventListener("jobtrack", (e) => {
   tracker[e.detail.track? "track": "stop"](e.detail.name);
});

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