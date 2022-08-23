import config from "../lib/config.js";
import mysql from "mysql2/promise";
import Elevation from "../lib/elevation.js";


const pool = await mysql.createPool(config.connection);
const elevation = new Elevation(pool);


await loadCache();
console.log("Running");
process.exit(0);

async function loadCache() {

    let points = await elevation.getAll();

    console.log(points);

}
