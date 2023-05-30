export default class Elevation {
    enable = true;
    
    constructor(map, config) {
        map.on("click", async ev => {
            if (!this.enable) return;
            // console.log(ev.latlng);
            let url = config.url.replace("$lat", ev.latlng.lat).replace("$lng", ev.latlng.lng);

            L.popup()
                .setLatLng(ev.latlng)
                .setContent("Fetching elevation...")
                .openOn(map);

            let response = await fetch(url);
            let elevation = await response.text();
            console.log("EL: " + elevation);

            L.popup()
                .setLatLng(ev.latlng)
                .setContent("<span title='Elevation above sea level.'>Elevation: " + elevation + 'm</span>')
                .openOn(map);
        });
    }
}