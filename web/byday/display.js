
export default class Display {
   constructor(config, map) {
      this.config = config;
      this.map = map;
   }

   async fetch() {
      let response = await fetch(this.config.countsUrl);
      return response.json();
   }
}
