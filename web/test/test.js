import Map from "../app/map.js";
import config from "./config.js";
import BreadCrumb from "../lib/breadcrumb.js";
import Destination from "../lib/destination.js";

const MS_TO_KMH = 3.6
const x = document.getElementById("messages");
const formatter = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 4});
const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 45000
};


let params = new URLSearchParams(document.location.search.substring(1));
let dev = params.get("dev");
if(dev) {
    let dumpster = document.getElementById("dumpster");
    dumpster.classList.remove("hide");
    let c = 0;
    console.log = function(...args) {
        dumpster.value += "\n" + c++ + " " + args.join("\t");
    }
}


let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;

let count = 0;

getLocation();

function getLocation() {    
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError, geoOptions);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

let breadcrumb = new BreadCrumb(map, config.breadcrumb);
window.breadcrumb = breadcrumb;
let watchCount = 0;

function showPosition(position) {
    /*
    timestamp: 1743631242285,
    coords: {
        accuracy: 1046.540898117061,
        latitude: -34.4588288,
        longitude: 138.8085248,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
    }
    */
    breadcrumb.add(position);
    //let dumpster = document.getElementById("dumpster");
    //if(dumpster) {
    //    dumpster.value = JSON.stringify(position, null, 3);
    //} else {
    console.log("Watch count = " + watchCount++ + "\n", position);
    //}

    let coords = position.coords;
    let buffer = [];
    createString("Latitude", 1, "°"); 
    createString("Longitude", 1, "°");
    createString("Altitude", 1, "m");
    
    x.innerHTML = buffer.join("<br/>");

    showSpeed(coords.speed, coords.heading);
    updatePosition(coords.latitude, coords.longitude);

    function createString(literal, multiplier = 1, tail = '') {
        let key = literal.toLowerCase()
        if(coords[key] !== null) {
            buffer.push("<span class='label'>" + literal + ":</span>" + formatter.format(coords[key] * multiplier) + tail);
        }
    }
}

// Select a destination
let waiSelect = document.querySelector("wai-select");
let waiEndpoint = document.querySelector("wai-endpoint");
let waiEndpointContainer = document.getElementById("endpointContainer")
let selectInProcess = false;
let marker = null;
waiSelect.addEventListener("click", async (ev) => {
    waiSelect.classList.add("hide");
    selectInProcess = true;
});


let destination = new Destination();
let destinationLatLng = destination.get();
if(destinationLatLng) {
    selectInProcess = true;
    pointSelected(destinationLatLng);
    waiSelect.classList.add("hide");
}

map.on("click", ev => {
    let latlng = ev.latlng;
    pointSelected(latlng);
    destination.set(latlng);
});

function pointSelected(latlng) {
    if(selectInProcess) {
        selectInProcess = false;
        let icon = L.divIcon({
            className: 'custom-div-icon',
            html: config.destinationIcon,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        marker = L.marker(latlng, { icon: icon }).addTo(map);
        marker.on("click", ev => {
            console.log("Please delete me and show the pointer again.");
            waiSelect.classList.remove("hide");
            waiEndpointContainer.classList.add("hide");
            map.removeLayer(marker);
            marker = null;
            destination.remove();
        });

        waiEndpoint.setAttribute("endlat", latlng.lat);
        waiEndpoint.setAttribute("endlng", latlng.lng);
        waiEndpointContainer.classList.remove("hide");
    }
}


// Recentering code 
let waiRecenter = document.querySelector("wai-recenter");
waiRecenter.classList.add("hide");
let panned = false;
let lastLatLng = null;
function updatePosition(lat, lng) {
    // Update the pointer to the destination.
    let endpoint = document.getElementById("endpoint");
    endpoint.setAttribute("startlng", lng);
    endpoint.setAttribute("startlat", lat);

    // We will do the map update here
    console.log("Panned " + panned);
    lastLatLng = [lat, lng];
    if(!panned) {
        map.panTo(lastLatLng);
    }
}

waiRecenter.addEventListener("recenter", async (e) => {
    let panned = false;
    map.panTo(lastLatLng);
    waiRecenter.classList.add("hide");
});

map.on("dragend", () => {
    waiRecenter.classList.remove("hide");
    console.log("drag end...");
    panned = true;
});


function showSpeed(speed, heading) {
    let compass = document.getElementById("speedCompass");
    let speedo = document.getElementById("speedValue");
    if(speed && speed >= 0.26) {
        speedo.classList.remove("hide");
        compass.classList.remove("hide");
        speedo.setAttribute("number", speed * MS_TO_KMH);
        compass.setAttribute("direction", heading);
    } else {
        speedo.classList.add("hide");
        compass.classList.add("hide");
    }
}

function showError(error) {
    switch (error.code) {
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