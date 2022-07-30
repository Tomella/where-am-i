import config from "../lib/config.js";
import mysql from "mysql";

import Job from "../lib/job.js";

run().then(() => console.log("Running")).then(() => {
    console.log("Finit");
});

async function run() {
    const pool = await createPool(config.connection);
    const job = new Job(pool);

    let exists = await job.exists("WalkApr20");
    console.log(exists);

    let response = await job.create("Spring21");
    console.log(response);
    pool.end();
    return response;

}


async function createPool(config) {
    return new Promise((resolve, reject) => {
        var pool = mysql.createPool(config);
        resolve(pool);
    });
}
