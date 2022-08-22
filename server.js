import express from "express";
import config from "./lib/config.js";
import mysql from "mysql2/promise";
import Job from "./lib/job.js";
import Journal from "./lib/journal.js";
import Path from "./lib/path.js";
import Point from "./lib/point.js";
import GeoJson from "./lib/geojson.js";

const port = 3000;

run().then(() => console.log("Running"));

async function run() {
   console.log("What the!")
   const pool = await mysql.createPool(config.connection);
   console.log("What the 2!")
   const job = new Job(pool);
   const journal = new Journal(pool);
   const path = new Path(pool);
   const point = new Point(pool);

   console.log("What the 3!")
   let jobsMap = await allJobsMap(job);
   console.log(jobsMap);

   var app = express();

   // serve static files

   app.use(express.static("web"));

   app.all('/gpslogger/:job', async (req, res) => {
      let id = req.params.job;
      let map = jobsMap[id];
      if (!map) {
         await createJob(id);
         jobsMap = await allJobsMap(job);
         map = jobsMap[id];
      }

      console.log(",\n" + JSON.stringify(req.query));

      try {
         await journal.log(map, req.query);
         res.status(200).send("OK");
      } catch (e) {
         console.log(e);
         res.status(500).send(e);
      }
   });

   app.all('/jobs', async (req, res) => {
      let jobs = await job.all();
      res.status(200).send(jobs);
   });

   app.all('/job/:id', async (req, res) => {
      let id = req.params.id;
      let data = await job.findById(+id);
      res.status(200).send(data);
   });

   app.all('/dateSummary', async (req, res) => {
      let summary = await point.dateSummary();
      console.log(",\n" + JSON.stringify(summary));
      let response = summary.map(entry => {
         return { 
            value: entry.value,
            date: entry.day.getFullYear() + "-" + pad(entry.day.getMonth() + 1) + "-" + pad(entry.day.getDate())
         }
      });
      
      console.log(",\n" + JSON.stringify(response));
      res.status(200).send(response);
   });

   app.all('/where', async (req, res) => {
      let result = await point.last();
      res.status(200).send(GeoJson.pointsToJson(result));
   });

   app.all('/template', async (req, res) => {
      res.status(200).send(config.gpsLogger.getTemplate.replace("${name}", req.query["job"]));
   });

   app.all('/paths/:job', (req, res) => {
      const pathBuffer = [];
      path.build(req.params["job"])
         .on("path", path => {
            console.log("path", path.points[0].time_point.toLocaleString("en-AU") + " to " +
               path.points[path.points.length - 1].time_point.toLocaleString("en-AU"));
            pathBuffer.push(path);
         })
         .on("error", error => {
            console.log("error", error);
         })
         .on("end", end => {
            console.log("end");
            res.status(200).send(GeoJson.pathsJson(pathBuffer));
         });
   });

   app.all('/points/:job', async (req, res) => {
      const count = req.query["count"];

      let points = await point.get(req.params["job"], count ? count : 200);
      res.status(200).send(GeoJson.pointsToJson(points));
   });

   app.all('/pointsById/:id', async (req, res) => {
      const count = req.query["count"];

      let points = await point.getById(+req.params["id"], count ? count : 200);
      console.log("WD", points);
      res.status(200).send(GeoJson.pointsToJson(points));
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });

   async function createJob(name) {
      return await job.create(name);
   }
}

function pad(num) {
   return num > 9 ? num : "0" + num;
}

async function allJobsMap(job) {
   const jobs = await job.all();
   return jobs.reduce((acc, job) => {
      console.log(job)
      acc[job.name] = job;
      return acc;
   }, {});
}
