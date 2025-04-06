/*
    // We use standard geolocation object within breadcrumb.

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

export default class BreadCrumb {
    constructor(map, config) {
        this.config = config;
        this.map = map;
        this.trail = [];
    }


    // Make up some arbitrarey rules about which to keep. All driven from the config.
    // The distance has to be greater than the accuracy.
    // The time has to be greater than a threshold.
    // The distamce travelled has to greater than some lower limit.
    add(geolocation) {
        let coords = geolocation.coords;
        let lat = coords.latitude;
        let lng = coords.longitude;
        let latLng = L.latLng(lat, lng);
        if(this.trail.length) {
            if(coords.accuracy > this.config.accuracy) {
                console.log("Accuracy too low by ", coords.accuracy - this.config.accuracy);
                return;
            }
            this.polyline.addLatLng(latLng);
        } else {
            // Do we have web storage?
            if(this.config.storage) {
                let now = new Date();
                let monthDay = now.getMonth() * 12 + now.getDate();
                let tempTrail = localStorage.getItem("breadcrumbData");
                tempTrail = tempTrail ? JSON.parse(tempTrail) : tempTrail;
                console.log("We have local storage", tempTrail);
                if(tempTrail) {
                    this.trail = tempTrail.filter(location => {
                        let pointTime = new Date(location.timestamp);
                        let locationmonthDay = pointTime.getMonth() * 12 + pointTime.getDate();
                        return locationmonthDay == monthDay;
                    });
                }
                console.log("We have local storage 2", tempTrail);
            }

            this.trail.push(geolocation);
            this.polyline = L.polyline(this.all(), {color: 'red', width: 10, opacity: 0.8}).addTo(map);
        }
        if(this.config.storage) {
            localStorage.setItem("breadcrumbData", JSON.stringify(this.trail));
        }
    }

    all() {
        return this.trail.map(location => [location.coords.latitude, location.coords.longitude]); 
    }
}

function getDistance(from, to) {
    container.innerHTML = ("New Delhi to Mumbai - " + (from.distanceTo(to)).toFixed(0)/1000) + ' km';
}