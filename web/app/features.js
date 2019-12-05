import loader from "./loader.js";

export default class Features {
   constructor(url) {
      this.url = url;
   }

   show(map) {
      return new Promise((resolve, reject) => {
         loader(this.url).then(response => {
            resolve(L.geoJSON(response).addTo(map));
         });
      });
   }
}