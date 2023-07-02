export default class Elevation {
    enable = true;

    NO_DATA = "<span title='No data received from service.'>No data.</span>";

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
            let message = (elevation == "null") ? 
                this.NO_DATA :
                ("<span title='Elevation above sea level.'>Elevation: " + elevation + 'm</span>');

            L.popup()
                .setLatLng(ev.latlng)
                .setContent(message)
                .openOn(map);
        });
    }
}