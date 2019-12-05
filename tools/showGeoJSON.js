
const config = require("../lib/config");
const mysql = require("mysql");

const GeoJSON = require("../lib/geojson");
const Journal = require("../lib/journal");
let connection;

run().then(() => {
   console.log("Finished");
   connection.end();
});

async function run() {
   connection = await createConnection(config.connection);
   const journal = new Journal(connection);
   const records = await journal.all();
   console.log(JSON.stringify(GeoJSON.journalJson(records), null,2));
}

async function createConnection(config) {
   return new Promise((resolve) => {
      const con = mysql.createConnection(config);
      resolve(con);
   });
}