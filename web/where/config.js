export default {
    map: {
       id: "mapId",
       options:  {
          center: [-34.454, 138.81],
          minZoom: 4,
          zoom: 16,
          maxZoom: 19
       },
       measure: {
         position: 'topleft',
         measureControlTitleOn: 'Draw and measure lines.',  
         measureControlTitleOff: 'Turn off measure.'  
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
    url: "/where/",
    menu: [
      {
         text: "View by day.",
         title: "See summary by day, show day's path.",
         href: "/byday.html"
      },
      {
         text: "View by job.",
         title: "Job names are allcoated generally over a number of days such as on a trip.",
         href: "/plots.html"
      }
    ]
 };
 