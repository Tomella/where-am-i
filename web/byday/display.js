
 export default class Display {
    constructor(url, map) {
       this.config = {
          url
       };
       this.map = map;
    }
 
    async fetch() {
       let response = await fetch(this.config.url);
       let data = await response.json();
 
       return data;
    }

 }
 