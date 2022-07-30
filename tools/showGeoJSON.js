import config from "../lib/config.js";
import mysql from "mysql";

import GeoJSON from "../lib/geojson.js";
import Journal from "../lib/journal.js";

let connection;

run().then(() => {
   console.log("Finished");
   connection.end();
});

async function run() {
   let pool  = await createPool(config.connection);
   const journal = new Journal(pool);
   const records = await journal.all();
   console.log(JSON.stringify(GeoJSON.journalJson(records), null,2));
}

async function createPool(config) {
  return new Promise((resolve, reject) => {
      var pool = mysql.createPool(config);
      resolve(pool);
   });
}