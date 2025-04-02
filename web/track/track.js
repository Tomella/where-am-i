import Elevation from "../lib/elevation.js";
import Map from "../app/map.js";
import Menu from "../app/menu.js";
import config from "./config.js";
import Jobs from "../lib/jobs.js";
import Tracker from "../app/tracker.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;

let waiMenu = document.querySelector("wai-menu");
let menu = new Menu(waiMenu, config.menu);

let elevation = new Elevation(map, config.elevation);
mapManager.on("measure-toggle", evt => {
    elevation.enable = !evt.detail.enabled;
});

let position = new Position();
map.addControl(position);
/*
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
*/
let params = new URLSearchParams(document.location.search.substring(1));
let job = params.get("job");
if(job) {
   gpsjobs.active = +job;
}

const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

function showError(error) {
   switch(error.code) {
     case error.PERMISSION_DENIED:
       x.innerHTML = "User denied the request for Geolocation."
       break;
     case error.POSITION_UNAVAILABLE:
       x.innerHTML = "Location information is unavailable."
       break;
     case error.TIMEOUT:
       x.innerHTML = "The request to get user location timed out."
       break;
     case error.UNKNOWN_ERROR:
       x.innerHTML = "An unknown error occurred."
       break;
   }
 }

getLocation();






    /* Create poits */
    let points = [
      {
          type: 'point',
          coordinates: L.latLng(-34.524, 139.14),
          color: '#27ae60',
          priority: 1,
      },
      {
          type: 'point',
          coordinates: L.latLng(-34.52, 139.109),
          color: '#f44334',
          priority: 3,
      },
      {
          type: 'img',
          coordinates: L.latLng(-34.52, 139.109),
          img: './images/icon.png',
          imgSize: [40, 40],
          priority: 2,
      },
      {
          type: 'point',
          coordinates: L.latLng(-34.503, 139.09),
          color: '#27ae60',
          priority: 1,
      },
      {
          type: 'img',
          coordinates: L.latLng(-34.503, 139.09),
          img: './images/icon.png',
          imgSize: [40, 40],
          priority: 2,
      },
      {
          type: 'point',
          coordinates: L.latLng(-34.495, 139.06),
          color: '#f44334',
          priority: 3,
      },
      {
          type: 'img',
          coordinates: L.latLng(-34.495, 139.06),
          prevLatlng: L.latLng(-34.503, 139.09),
          img: './img/arrow.svg',
          imgSize: [50, 50],
          priority: 2,
      },
  ];


  /* Show lines */
  const line = points.map(point => point.coordinates);
  L.polyline(line, {color: '#178a00'}).addTo(map);


  /* Show points */
  points.sort((a, b) => a.priority - b.priority);

  points.forEach(point => {
      switch (point.type) {
          case 'point':
              L.circleMarker(point.coordinates, {
                  radius: 8,
                  fillColor: point.color,
                  fillOpacity: 1,
                  color: '#fff',
                  weight: 3,
              }).addTo(map);
              break;
          case 'img':
              const coordinatesPopup = '[' + point.coordinates.lat + ',' + point.coordinates.lng + ']';
              L.canvasMarker(point.coordinates, {
                  prevLatlng: point.prevLatlng,
                  img: {
                      url: point.img,
                      size: point.imgSize,
                      rotate: point.imgRotate || 0,
                      offset: point.offset || { x: 0, y: 0 },
                  },
              }).bindPopup(coordinatesPopup).addTo(map);
              break;
      }
  });