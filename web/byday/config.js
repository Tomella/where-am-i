export default {
   map: {
      id: "mapId",
      scale: {
         position: "bottomright",
         imperial: false
      },
      options: {
         center: [-34.454, 138.81],
         minZoom: 4,
         zoom: 16,
         maxZoom: 19
      },
      measure: {
         position: 'topleft',
         measureControlTitleOn: 'Draw and measure lines, turn off elevation at a point.',
         measureControlTitleOff: 'Elevation at a point, turn off measure'
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
   heightGraph: {
      position: "topright",
      highlightStyle: {
         weight: 4,
         opacity: 0.7,
         color: 'black'
      },
      translation: {
         distance: "Distance",
         elevation: "Elevation",
         segment_length: "Segment length",
         type: "Type",
         legend: "Elevation for points on:"
      }
   },
   plotter: {}, // Hmm, may want something somedays
   countsUrl: "/countsByDay",
   elevation: {
      url: "/elevationAtPoint?lat=$lat&lng=$lng"
   },
   dateUrl: "/pointsByDate/$year/$month/$date",
   jobs: {
      listUrl: "jobs",
      jobsForDate: "/jobsForDate/$year/$month/$date"
   },
   menu: [
      {
         text: "Last seen...",
         title: "See where last seen.",
         href: "/"
      },
      {
         text: "View by job.",
         title: "Job names are allcoated generally over a number of days such as on a trip.",
         href: "/plots.html"
      }
   ]
};
