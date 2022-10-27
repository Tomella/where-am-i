export default class Elevation {
   constructor(url) {
      this.url = url;
   }

   async find(latlng) {
      let response = await fetch(url);
      console.log(response)
      return response;
   }
}
