import Points from "./points.js";

export default class Tracker {
   constructor(config, map) {
      this.config = config;
      this.map = map;
      this.tracked = {};
      this.colorIndexLength = config.colors.length;
      this.colorIndex = -1;
   }

   track(name) {
      let track = this.stop(name);
      if(!track) {
         this.colorIndex = ++this.colorIndex % this.colorIndexLength;
         track = this.tracked[name] = new Points({...this.config,
            fillColor: this.config.colors[this.colorIndex]}, name, this.map);
      }
      track.run();
   }

   stop(name) {
      if(this.tracked[name]) {
         this.tracked[name].stop();
      }
      return this.tracked[name]
   }
}
