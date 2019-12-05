module.exports = {
   connection: {
      host: process.env.GPSLOGGER_DB_HOST,
      user: process.env.GPSLOGGER_DB_USERNAME,
      password: process.env.GPSLOGGER_DB_PASSWORD,
      database: "logger3d"
   },
   loggingUrl: "https://gpslogger.geospeedster.com/log/walking?"
};