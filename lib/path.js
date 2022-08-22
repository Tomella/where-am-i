import events from 'events';
import Job from './job.js';

export default class Path {
   constructor(pool, options = {}) {
      this.pool = pool;
      this.options = Object.assign({
         newPathBreak: 13 * 60 * 1000     // Thirteen minutes is the arbitrary time between paths
      }, options);
      this.job = new Job(pool);
   }

   async build(job) {
      let queryStr = 'SELECT * FROM journal';
      // Is it a
      if (job) {
         queryStr += " where job_id = (select id from job where name = ?)";
      }
      let eventEmitter = new events.EventEmitter();

      let response = this.getJobs();
      let newPathBreak = this.options.newPathBreak;

      let jobs = response.reduce((acc, job) => {
         acc[job.id] = job;
         return acc;
      }, {});

      let accumulator = {};

      let query = pool.query(queryStr, [job]);
      
      query
         .on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log("Whey", err);
            endPaths();
            eventEmitter.emit("error", err)
         })
         .on('result', function (row) {
            let path = accumulator[row.job_id];
            if (!path) {
               path = accumulator[row.job_id] = {};
            }
            let last = path.last;
            let points = path.points;

            if (!last) {
               last = path.last = row;
               points = path.points = [row];
            } else {
               if (newPathBreak < row.time_point.getTime() - last.time_point.getTime()) {
                  emitPath(row.job_id);
                  path.points = [row];
                  accumulator[row.job_id] = path;
               } else {
                  points.push(row);
               }
               path.last = row;
            }
         })
         .on('end', function () {
            // all rows have been received
            endPaths();
            eventEmitter.emit("end");
         });
      
      function endPaths() {
         let keys = Object.keys(accumulator);
         keys.forEach(key => emitPath(key))
      }

      function emitPath(key) {
         connection.pause();
         let current = accumulator[key];
         if (current && current.points.length > 1) {
            let response = { job: jobs[key], points: current.points }
            //console.log(response.job, current.points[0]);
            eventEmitter.emit("path", response);
         }
         delete accumulator[key];
         connection.resume();
      }
      return eventEmitter;
   }

   async getJobs() {
      if (!this.jobs) {
         this.jobs = await this.job.all();
      }
      return this.jobs;
   }
}
