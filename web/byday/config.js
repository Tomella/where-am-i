export default {
    map: {
       id: "mapId",
       options:  {
          center: [-34.454, 138.81],
          minZoom: 5,
          zoom: 16,
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
    countsUrl: "/countsByDay"
 };
 