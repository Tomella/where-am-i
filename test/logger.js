import config from "../lib/config.js";
import mysql from "mysql2/promise";
import Job from "../lib/job.js";
import Journal from "../lib/journal.js";

const REQ_QUERY = {
    dist: 0,
    sat: 0,
    dir: 0.0,
    acc: 49.520999908447266,
    alt: 199.79998779296875,
    lat: -34.4557871,
    lon: 138.8107878,
    time: "2022-08-23T01:15:21.092Z",
    s: 0.0
};

const JOB_NAME = "Dummy" + Date.now();
console.log(JOB_NAME)

const pool = await mysql.createPool(config.connection);
const job = new Job(pool);
const journal = new Journal(pool);


await createJob();
console.log("Running");
process.exit(0);

async function createJob() {

    let jobsMap = await allJobsMap(job);


    // serve static files
    let map = jobsMap[JOB_NAME];
    let id = null;
    if (map) {
        console.log("Found from map:", map)
        id = map.id;
    } else {
        id = await job.create(JOB_NAME);
    }

    console.log(",\n" + JSON.stringify(REQ_QUERY));
    try {
        let response = await journal.log(id, REQ_QUERY);

        console.log(response);
    } catch (e) {
        console.log(e);
    }

}


async function allJobsMap(job) {
    const jobs = await job.all();
    return jobs.reduce((acc, job) => {
        acc[job.name] = job;
        return acc;
    }, {});
}