import loader from "./loader.js";

const geojsonMarkerOptions = {
   radius: 5,
   fillColor: "#ff7800",
   color: "#000",
   weight: 1,
   opacity: 1
};

export default class Points {
   constructor(config, job, map) {
      this.config = {
         ...geojsonMarkerOptions,
         ...config
      };
      this.job = job;
      this.map = map;
   }

   show() {
      return new Promise((resolve, reject) => {
         loader(this.config.url + this.job + "?count=" + this.config.count).then(response => {
            let me = this;
            if (!this.last || this.last !== response.features[0].properties.name) {
               if (this.layer) this.layer.remove();

               // We want to reverse te features so lets shallow copy and reverse
               let count = response.features.length;
               let latest = response.features[0];
               this.last = latest.properties.name;

               response.features = response.features.reverse().map((feature, index) => {
                  feature.properties.opacity = (index + 1) / count;
                  return feature;
               });

               this.layer = L.geoJSON(response, {
                  pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                     ...this.config,
                     fillOpacity: feature.properties.opacity,
                     opacity: feature.properties.opacity
                  })
               }).bindTooltip(layer => layer.feature.properties.name, { permanent: false });
               this.layer.addTo(this.map)
               this.map.panTo(latest.geometry.coordinates.reverse());
               resolve(true);
            } else {
               resolve(false);
            }
         });
      });
   }

   run() {
      let pointsLoop = () => {
         let delay = 2000;
         this.show().then(result => {
            // If there hasn't been an update then extend the time to look.
            if (!result) {
               delay = 20000;
            }
         }).finally(() => {
            this.timeOut = setTimeout(pointsLoop, delay);
         });
      };
      pointsLoop();
   }

   stop() {
      clearTimeout(this.timeOut);
      this.layer.remove();
      delete this.last;
   }
}