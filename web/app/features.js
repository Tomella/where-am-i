import loader from "./loader.js";

export default class Features {
   constructor(url) {
      this.url = url;
   }

   async show(map) {
      let response = await loader(this.url);
      return L.geoJSON(response).addTo(map);
   }
}
