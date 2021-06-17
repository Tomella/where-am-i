const config = require("../lib/config");
const mysql = require("mysql");
const Path = require("../lib/path");
const GeoJSON = require("../lib/geojson");

let connection;
let buffer = [];

run().then(fin => {
   console.log("finit");
   connection.end();
   //console.log(JSON.stringify(GeoJSON.pathsJson(buffer)));
})

async function run() {
   connection = await createPool(config.connection);
   const path = new Path(connection);

   return new Promise(function (resolve, reject) {
      const paths = path.build()
         .on("path", path => {
            console.log("path", path.points[0].time_point.toLocaleString("en-AU") + " to " +
               path.points[path.points.length - 1].time_point.toLocaleString("en-AU"));
               buffer.push(path);
         })
         .on("error", error => {
            console.log("error", error);
         })
         .on("end", end => {
            console.log("end", end);
            resolve(true);
         });
   });
}


async function createPool(config) {
   return new Promise((resolve, reject) => {
      var pool = mysql.createPool(config);
      resolve(pool);
   });
}
