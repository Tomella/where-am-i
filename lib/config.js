export default {
   staticMappings: [
      {
         path: '/', 
         mapping: './web'
      },
      {
         path: '/heightgraph', 
         mapping: './node_modules/leaflet.heightgraph/dist'
      }
   ],
   connection: {
      host: process.env.GPSLOGGER_DB_HOST,
      user: process.env.GPSLOGGER_DB_USERNAME,
      password: process.env.GPSLOGGER_DB_PASSWORD,
      database: "logger3d"
   },
   loggingUrl: "https://gpslogger.geospeedster.com/gpslogger/{jobName}?",
   defaultJobname: "Fred",
   gpsLogger: {
      getTemplate: "https://gpslogger.geospeedster.com/gpslogger/${name}?dist=%DIST&sat=%SAT&dir=%DIR&acc=%ACC&alt=%ALT&lat=%LAT&lon=%LON&time=%TIME&s=%SPD"
   },
   dem: {
       template: "https://api-elevation.fsdf.org.au/elevation-at-point?lat=$lat&long=$lng",
       responseMappings: {
           "-inf": -999
       }
   }
};
