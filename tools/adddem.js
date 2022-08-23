
import Journal from '../lib/journal.js';
import Elevation from '../lib/elevation.js';
import config from "./config.js";
import mysql from "mysql2/promise";

const mapLocations = {};
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let pool = null;

try {
    await run();
    console.log("Finit");
} catch (err) {
    console.log("Something went wrong, ending pool.", err);
} finally {
    if(pool)
       pool.end()
};

async function run() {
    pool = await mysql.createPool(config.connection);

    const elevation = new Elevation(pool, config.dem);
    /*    
        const LAT = -25.93987;
        const LNG = 147.94942;
        let dem = await elevation.getCached(LAT + 0.00005, LNG);
        console.log("Should be null:", dem);
    
        dem = await elevation.getCached(LAT, LNG);
        console.log("Should be a number:", dem);
    
        dem = await elevation.load(LAT, LNG);
        console.log("If the service is up, another number:", dem);
    */

    const journal = new Journal(pool);
    let results = await journal.pageNeedingDem(config.dem.recordsPerPage);

    console.log(results);
    let past = Date.now();
    let start = past;
    for (let i = 0; i < results.length; i++) {
        let record = results[i];
        let dem = await elevation.get(record.latitude, record.longitude);

        if (dem !== null) {
            await journal.updateDem(record.id, dem);
            await sleep(1000);
        }
        if (i % 5 === 4) {
            let now = Date.now();

            let duration = now - past;
            let t = howLong(duration);
            past = now + t; // We want to start the count

            console.log((duration / 1000) + "s for last (of " + (i + 1) + " records processed on this run " + ((now - start) / 1000) + "s)");
            
            console.log("sleeping " + Math.round(t/1000) + "s at " + (new Date()).toLocaleTimeString());
            await sleep(t);
        }
    }
}

function howLong(duration) {
    if(duration < 15000) return 0;
    if(duration < 20000) return 40;
    if(duration < 30000) return 120;
    if(duration < 40000) return 300;
    if(duration < 52000) return 700;
    if(duration < 68000) return 1200;
    if(duration < 75000) return 1800;
    if(duration < 98000) return 2400;
    return 6000;
}
