export default {
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
   }
};
