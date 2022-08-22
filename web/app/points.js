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

   async show() {
      let response = await loader(this.config.url + this.job + "?count=" + this.config.count);

      if (!this.last || this.last !== response.features[0].properties.name) {
         if (this.layer) this.layer.remove();

         // We want to reverse the features so lets shallow copy and reverse
         let count = response.features.length;
         let latest = response.features[0];
         this.last = latest.properties.name;

         response.features = response.features.reverse().map((feature, index) => {
            feature.properties.opacity = 0.2 + (index + 1) / count * 0.7 ;
            return feature;
          });

         this.layer = L.geoJSON(response, {
            pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
               ...this.config,
               fillOpacity: feature.properties.opacity,
               opacity: feature.properties.opacity
            })
         }).bindTooltip(layer => layer.feature.properties.name, { permanent: false });
         this.layer.addTo(this.map);
         this.map.fitBounds(this.layer.getBounds(), {padding: [100,100]});
         let coords = latest.geometry.coordinates;
         this.map.panTo([coords[1], coords[0]]);
         return true;
      } else {
         return false;
      }
   }

   async run() {
      let pointsLoop = async (delay = 4000) => {
         try {
            let result = await this.show();
            // If there hasn't been an update then extend the time to look.
            if (!result) {
               delay = 30000;
            }
         } finally {
            this.timeOut = setTimeout(pointsLoop, delay);
         }
      };
      await pointsLoop(20000); //Some of the datasets are a bit big for the little server to process so give it some time.
   }

   stop() {
      clearTimeout(this.timeOut);
      this.layer.remove();
      delete this.last;
   }
}
