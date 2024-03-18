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
   decorator: {
      speedSteps: 32
   },
   plotter: {
      colorMap: {
         0: "green", 
         1: "#264CFF", 
         2: "#2C62FF", 
         3: "#3682FF", 
         4: "#3FA0FF", 
         5: "#4BADFF", 
         6: "#5FC3FF", 
         7: "#72D8FF", 
         8: "#80E0FF", 
         9: "#94EBFF", 
         10:"#AAF7FF", 
         11:"#BCFAFF", 
         12:"#CFFDFF", 
         13:"#E0FFFF", 
         14:"#EAFFEA", 
         15:"#F5FFD3", 
         16:"#FFFFBF", 
         17:"#FFF5B3", 
         18:"#FFE9A5", 
         19:"#FFE099", 
         20:"#FFCF8C", 
         21:"#FFBD7F", 
         22:"#FFAD72", 
         23:"#FD986C", 
         24:"#FA8164", 
         25:"#F76D5E", 
         26:"#ED554F", 
         27:"#E23C40", 
         28:"#D82632", 
         29:"#C7192C", 
         30:"#B50C26", 
         31:"#A50021"
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
