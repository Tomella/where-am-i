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


      let latest = data.features[0];
      console.log("latest", latest, this.lastTime)
      if(this.lastTime && this.lastTime === latest.properties.time_point) {
         this.lastTime = latest.properties.time_point;
         return false;
      }

      document.dispatchEvent(new CustomEvent("position", {
         detail: latest
      }));

      this.lastTime = latest.properties.time_point;
      if (this.layer) this.layer.remove();
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
         let delay = 8000;
         let result = await this.show();
         // If there hasn't been an update then extend the time to look.
         if (!result) {
            delay = 40000;
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
