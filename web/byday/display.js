
export default class Display {
   constructor(id, config, map) {
      this.id = id;
      this.config = config;
      this.map = map;
   }

   fetch() {
      fetch(this.config.jobUrl + this.id).then(response => {
         response.json().then(data => {
            this.details = data;
         });
      });

      fetch(this.config.pointsById + this.id).then(response => {
         response.json().then(data => {
            this.points = data;
         });
      });
   }
}
