const geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1
};

export default class Plotter {
    constructor(config, map) {
        this.config = {
            ...geojsonMarkerOptions,
            ...config
        };
        this.map = map;
    }

    show(response) {
        if (this.layer) this.layer.remove();
        if(!response || !response.features || response.features.length == 0) {
            return;
        }

        if (!this.last || this.last !== response.features[0].properties.name) {

            // We want to reverse the features so lets shallow copy and reverse
            let count = response.features.length;
            let latest = response.features[0];
            this.last = latest.properties.name;

            response.features = response.features.map((feature, index) => {
                feature.properties.opacity = 0.2 + (index + 1) / count * 0.7;
                return feature;
            });

            this.layer = L.geoJSON(response, {
                pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                    ...this.config,
                    fillOpacity: feature.properties.opacity,
                    opacity: feature.properties.opacity,
                    get fillColor () {
                        console.log(feature);
                        let speed = feature.properties.speed;
                        let keys = Object.keys(this.colorMap);
                        let lastKey = 0;
                        let index = keys.find(key => {
                            if(speed <= 0 + key) {
                                return true;
                            }
                            lastKey = key;
                            return false;
                        } );
                        return this.colorMap[lastKey]; 
                    }
                })
            }).bindTooltip(layer => layer.feature.properties.name, { permanent: false });
            this.layer.addTo(this.map);
            this.map.fitBounds(this.layer.getBounds(), { padding: [200, 200] });
            let coords = latest.geometry.coordinates;
            this.map.panTo([coords[1], coords[0]]);
            return true;
        } else {
            return false;
        }
    }

    remove() {
        this.layer.remove();
        delete this.last;
    }
}
