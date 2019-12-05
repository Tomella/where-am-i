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

   const jobsMap = await allJobsMap(job);
   console.log(jobsMap);

   let seperator = __dirname.indexOf("/") > -1 ? "/" : "\\";
   let appsRoot = __dirname.substr(0, __dirname.lastIndexOf(seperator));

   //var httpProxy = require('http-proxy');
   var app = express();

   // serve static files

   app.use(express.static("web"));

   app.all('/gpslogger/:job', function (req, res) {

      let job = jobsMap[req.params["job"]];
      if (!job) {
         res.status(500).send("No job named " + req.params["job"]);
         return;
      }

      console.log(",\n" + JSON.stringify(req.query));

      journal.log(job, req.query).then(response => {
         res.status(200).send("OK");
         // console.log(job +":", req.query);
      }).catch(e => {
         console.log(e);
         res.status(500).send(e);
      })
   });

   app.all('/jobs', function (req, res) {
      job.all().then(jobs => {
         res.status(200).send(jobs);
      });
   });

   app.all('/paths/:job', function (req, res) {
      const pathBuffer = [];
      path.build(req.params["job"])
         .on("path", path => {
            console.log("path", path.points[0].time_point.toLocaleString("en-AU") + " to " +
               path.points[path.points.length - 1].time_point.toLocaleString());
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


   app.all('/pathsSummary/:job', function (req, res) {
      const pathBuffer = [];
      path.build(req.params["job"])
         .on("path", path => {
            console.log("path", path.points[0].time_point.toLocaleString("en-AU") + " to " +
               path.points[path.points.length - 1].time_point.toLocaleString());
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

   app.all('/points/:job', function (req, res) {
      const count = req.query["count"];

      point.get(req.params["job"], count ? count : 200).then(points => {
         res.status(200).send(GeoJson.pointsToJson(points));
      });
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });
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
