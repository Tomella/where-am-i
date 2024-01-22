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
   plotter: {
      colorMap: {
         2: "#44EEEF",
         2.5: "#4CE2EF",
         3: "#55D6EF",
         3.5: "#5DCAEF",
         4: "#66BEEF",
         4.5: "#6EB2EF",
         5: "#77A6EF",
         5.5: "#7F9AEF",
         6: "#888EEF",
         6.5: "#7F9AEF",
         7: "#888EEF",
         8: "#9082EF",
         10: "#9977EF",
         12: "#A16BEF",
         15: "#AA5FEF",
         19: "#B253EF",
         23: "#BB47EF",
         30: "#C33BEF",
         40: "#CC2FEF",
         60: "#D423EF",
         80: "#DD17EF",
         100: "#E50BEF",
         120: "#EE00EF"
      }
   }, 
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
