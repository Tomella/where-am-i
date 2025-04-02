export default {
   map: {
      id: "mapId",
      scale: {imperial: false},
      options:  {
         center: [-34.554, 139.01],
         minZoom: 5,
         zoom: 12,
         maxZoom: 19
      },
      measure: {
        position: 'topleft',
        measureControlTitleOn: 'Draw and measure lines.',  
        measureControlTitleOff: 'Turn off measure'    
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
   jobs: {
      listUrl: "jobs"
   },
   tracker: {
      url: "points/",
      count: 24000,
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
         "#fcfce6",
         "#4cfce6",
         "#6cfce6",
         "#acfce6"
      ]
   },
   elevation: {
      url: "/elevationAtPoint?lat=$lat&lng=$lng"
   },
   elevationAtPoint: {
      url: "/elevationAtPoint?lat=$lat&lng=&lng"
   },
   controls: {
      id: "controls"
   },
   menu: [
      {
         text: "View by day.",
         title: "See summary by day, show day's path.",
         href: "/byday.html"
      },
     {
        text: "Last seen...",
        title: "See where last seen.",
        href: "/"
     }
   ]
};
