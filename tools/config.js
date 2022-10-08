export default {
    connection: {
       host: process.env.GPSLOGGER_DB_HOST,
       user: process.env.GPSLOGGER_DB_USERNAME,
       password: process.env.GPSLOGGER_DB_PASSWORD,
       database: "logger3d"
    },
    dem: {
        template: "https://api-elevation.fsdf.org.au/elevation-at-point?lat=$lat&long=$lng",
        recordsPerPage: process.env.GPSLOGGER_RECORDS_PER_PAGE ? +process.env.GPSLOGGER_RECORDS_PER_PAGE : 20,
        responseMappings: {
            "-inf": -999
        }
    },
    loggingUrl: "https://gpslogger.geospeedster.com/gpslogger/{jobName}?",
    defaultJobname: "Pending",
    gpsLogger: {
       getTemplate: "https://gpslogger.geospeedster.com/gpslogger/${name}?dist=%DIST&sat=%SAT&dir=%DIR&acc=%ACC&alt=%ALT&lat=%LAT&lon=%LON&time=%TIME&s=%SPD"
    }
 };
 