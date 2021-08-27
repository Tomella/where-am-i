const geojsonMarkerOptions = {
   radius: 7,
   fillColor: "#ff7800",
   color: "#000",
   weight: 1,
   opacity: 1
};

export default class Points {
   constructor(url, map) {
      this.config = {
         ...geojsonMarkerOptions,
         url
      };
      this.map = map;
   }

   async show() {
      let response = await fetch(this.config.url);
      let data = await response.json();

      if (this.layer) this.layer.remove();

      let latest = data.features[0];
      this.last = latest.properties.name;

      this.layer = L.geoJSON(data, {
         pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            ...this.config,
            fillOpacity: feature.properties.opacity,
            opacity: feature.properties.opacity
         })
      }).bindTooltip(layer => layer.feature.properties.name, { permanent: false });
      this.layer.addTo(this.map)
      this.map.panTo(latest.geometry.coordinates.reverse());
      return true;
   }

   async run() {
      let pointsLoop = async () => {
         let delay = 4000;
         let result = await this.show();
         // If there hasn't been an update then extend the time to look.
         if (!result) {
            delay = 20000;
         }
         this.timeOut = setTimeout(pointsLoop, delay);
      };
      pointsLoop();
   }

   stop() {
      clearTimeout(this.timeOut);
      this.layer.remove();
      delete this.last;
   }
}
