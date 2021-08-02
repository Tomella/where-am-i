const express = require("express");
const port = 3000;
const config = require("./lib/config");
const mysql = require("mysql");

const Job = require("./lib/job");
const Journal = require("./lib/journal");
const Path = require("./lib/path");
const Point = require("./lib/point");
const GeoJson = require("./lib/geojson");

run().then(() => console.log("Running"));

async function run() {
   const pool = await createPool(config.connection);
   const job = new Job(pool);
   const journal = new Journal(pool);
   const path = new Path(pool);
   const point = new Point(pool);

   let jobsMap = await allJobsMap(job);
   console.log(jobsMap);

   let seperator = __dirname.indexOf("/") > -1 ? "/" : "\\";
   let appsRoot = __dirname.substr(0, __dirname.lastIndexOf(seperator));

   //var httpProxy = require('http-proxy');
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


   app.all('/pathsSummary/:job', (req, res) => {
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
            console.log("end", pathBuffer);
            res.status(200).send(pathBuffer);
         });
   });

   app.all('/points/:job', async (req, res) => {
      const count = req.query["count"];

      let points = await point.get(req.params["job"], count ? count : 200);
      res.status(200).send(GeoJson.pointsToJson(points));
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });

   async function createJob(name) {
      return await job.create(name);
   }
}

async function allJobsMap(job) {
   const jobs = await job.all();
   return jobs.reduce((acc, job) => {
      console.log(job)
      acc[job.name] = job;
      return acc;
   }, {});
}

async function createPool(config) {
   return new Promise((resolve, reject) => {
      var pool = mysql.createPool(config);
      resolve(pool);
   });
}
