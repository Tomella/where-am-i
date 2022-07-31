import Points from "./points.js";

export default class Tracker {
   constructor(config, map) {
      this.config = config;
      this.map = map;
      this.tracked = {};
      this.colorIndexLength = config.colors.length;
      this.colorIndex = -1;
   }

   async track(name) {
      let track = this.stop(name);
      if(!track) {
         this.colorIndex = ++this.colorIndex % this.colorIndexLength;
         track = this.tracked[name] = new Points({...this.config,
            fillColor: this.config.colors[this.colorIndex]}, name, this.map);
      }
      return await track.run();
   }


   extent(details) {
      let bounds = [[details.miny, details.minx], [details.maxy, details.maxx]];
      let rectangle = L.rectangle(bounds, {color: "#ff7800", weight: 1});
      let opacity = 1;

      rectangle.addTo(this.map);
      this.map.fitBounds(bounds, {padding: [100,100]});

      let fader = () => {
         if(opacity > 0.1) {
            rectangle.setStyle({
               opacity: opacity,
               fillOpacity: opacity / 5
             });
             opacity -= 0.01;
             setTimeout(fader, 20);
         } else {
            rectangle.remove();
         }
      }
      setTimeout(fader, 3000);

   }

   stop(name) {
      if(this.tracked[name]) {
         this.tracked[name].stop();
      }
      return this.tracked[name]
   }
}
