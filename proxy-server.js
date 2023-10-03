import express from "express";
import config from "./lib/proxy_config.js";

const fetch = require('node-fetch');

const port = 3000;
const BASE_URL = config.baseUrl;


run().then(() => console.log("Running"));

async function run() {

   var app = express();

   // serve static files
   //app.use(express.static("web"));

   // Typically, we take some npma installed caode and allow them through as static content.
   app.all('/gpslogger/:job', async (req, res) => {
      let name = req.params.job;
      let map = jobsMap[name];
      let id = null;
      if (!map) {
         id = await createJob(name);
      } else {
         id = map.id;
      }

      console.log(",\n" + JSON.stringify(req.query));

      try {
         await journal.log(id, req.query);

         if(!map) {
            jobsMap = await allJobsMap(job);
         } else {
            map.points += 1;
         }
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

   app.all('/countsByDay', async (req, res) => {
      const response = await fetch(BASE_URL + 'countsByDay');
      const body = await response.text();
      res.status(200).send(body);
   });


   app.all('/job/:id', async (req, res) => {
      const id = req.params.id;
      const response = await fetch(BASE_URL + 'job/' + id);
      const body = await response.text();
      res.status(200).send(body);
   });

   app.all('/dateSummary', async (req, res) => {
      const response = await fetch(BASE_URL + 'dateSummary');
      const body = await response.text();
      res.status(200).send(body);
   });

   app.all('/where', async (req, res) => {
      const response = await fetch(BASE_URL + 'where');
      const body = await response.text();
      res.status(200).send(body);
   });

   app.all('/template', async (req, res) => {
      res.status(200).send(config.gpsLogger.getTemplate.replace("${name}", req.query["job"]));
   });
/*
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
      
      const response = await fetch(BASE_URL + 'points/' + job);
      const body = await response.text();
      res.status(200).send(body);
   });

   app.all('/pointsById/:id', async (req, res) => {
      const count = req.query["count"];

      let points = await point.getById(+req.params["id"], count ? count : 200);
      console.log("WD", points);
      res.status(200).send(GeoJson.pointsToJson(points));
   });


   app.all('/pointsByDate/:year/:month/:date', async (req, res) => {
      const count = req.query["count"];

      let date = new Date(+req.params["year"], (+req.params["month"]) - 1, +req.params["date"]);

      let points = await point.getByDate(date, count ? count : 4000);
      console.log("WD", points);
      res.status(200).send(GeoJson.pointsToJson(points));

      
   });

   app.get('/jobsForDate/:year/:month/:date', async (req, res) => {
      let date = new Date(+req.params["year"], (+req.params["month"]) - 1, +req.params["date"]);
      let data = await journal.countsForDay(date);
      res.status(200).send(data);
   });

   app.get('/elevationPoints',  async (req, res) => {
      let points = await elevation.getAll();
      res.status(200).send(points);
   });

   app.get('/elevationAtPoint',  async (req, res) => {
      console.log("PARAMS", req.query);
      try {
         let height = await elevation.get(+req.query.lat, +req.query.lng);
         res.status(200).send("" + height);
      } catch(e) {
         console.log(e)
         res.status(500).send("Whoops, were are the lat lng parameters.");
      }
   });
*/
   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });

}
