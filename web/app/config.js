export default {
   map: {
      id: "mapId",
      options:  {
         center: [-34.454, 138.81],
         minZoom: 5,
         zoom: 14,
         maxZoom: 20
      },
      layers: [
         {
            type: "tileLayer",
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
               maxZoom: 20,
               attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
               subdomains: ['a', 'b', 'c']
            }
         }
      ]
   },
   jobs: {
      listUrl: "jobs"
   },
   featuresUrl: "paths/Walking",
   tracker: {
      url: "points/",
      count: 20000,
      colors:[
         "#ff7800",
         "#00ff78",
         "#7800ff",
         "#f72ace",
         "#cbf72a",
         "#f72a2a",
         "#2a9bf7",
         "#ff0000",
         "#fffb00",
         "#fcfce6"
      ]
   },
   controls: {
      id: "controls"
   }
};
