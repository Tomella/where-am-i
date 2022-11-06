export default {
    map: {
       id: "mapId",
       options:  {
          center: [-34.454, 138.81],
          minZoom: 4,
          zoom: 16,
          maxZoom: 19
       },
       layers: [
          {
             type: "tileLayer",
             url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
             options: {
                maxZoom: 20,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: ['a', 'b', 'c']
             }
          }
       ]
    },
    plotter: { }, // Hmm, may want something somedays
    countsUrl: "/countsByDay",
    elevationUrl: "/elevationAtPoint?lat=$lat&lng=$lng",
    dateUrl: "/pointsByDate/$year/$month/$date"
 };
 