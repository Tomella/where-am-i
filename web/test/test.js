/*
let periods = document.querySelector("wai-periods");

periods.addEventListener("periodchange", (ev) => {
    console.log("Event for periods", ev)
});


let distCompass = document.querySelector("#distCompass");

let dist = 0;

setInterval(() => {
    distCompass.setAttribute("direction", dist);
    dist += 0.4;
}, 10)

*/

const MS_TO_KMH = 3.6
const x = document.getElementById("demo");
const formatter = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 5});
const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 100,
    timeout: 45000
};

let count = 0;

getLocation();

function getLocation() {    
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError, geoOptions);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

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

    let dumpster = document.getElementById("dumpster");
    if(dumpster) {
        dumpster.value = JSON.stringify(position, null, 3);
    }

    let coords = position.coords;

    let buffer = [];
    createString("Latitude"); 
    createString("Longitude");
    createString("Altitude");
    createString("Heading");
    createString("Speed", MS_TO_KMH);
    buffer.push("Update No: " + ++count);
    
    x.innerHTML = buffer.join("<br/>");

    showSpeed(coords.speed, coords.heading);
    updatePosition(coords.latitude, coords.longitude);

    function createString(literal, multiplier = 1) {
        let key = literal.toLowerCase()
        if(coords[key] !== null) {
            buffer.push(literal + ": " + formatter.format(coords[key] * multiplier));
        }
    }
}

function updatePosition(lat, lng) {
    // Update the pointer to the destination.
    let endpoint = document.getElementById("endpoint");
    endpoint.setAttribute("startlng", lng);
    endpoint.setAttribute("startlat", lat);

    // We will do the map update here
}


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