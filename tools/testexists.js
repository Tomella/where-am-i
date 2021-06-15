
const config = require("../lib/config");
const mysql = require("mysql");

const Job = require("../lib/job");

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
    return response;

}


async function createPool(config) {
    return new Promise((resolve, reject) => {
        var pool = mysql.createPool(config);
        resolve(pool);
    });
}
