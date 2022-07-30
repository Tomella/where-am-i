export default class Point {
   constructor(pool, options = {}) {
      this.pool = pool;
   }

   async get(job, count = 200) {
      let queryStr = 'SELECT * FROM journal';
      // Is it a
      if (job) {
         queryStr += " where job_id = (select id from job where name = ?)";
      }

      queryStr += " order by time_point desc limit ?"; // Stops malicious sql injection, will throw error

      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query(queryStr, [job, +count], function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(results, fields);
               }
            });
         });
      });
   }

   async last() {
      let queryStr = 'SELECT * FROM journal order by time_point desc limit 1';
      return this.query(queryStr);
   }

   async dateSummary() {
      let queryStr = 'SELECT CAST(time_point AS DATE) as day, COUNT(*) as value FROM journal GROUP BY CAST(time_point AS DATE)';
      return this.query(queryStr);
   }

   query(queryStr) {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query(queryStr, function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(results, fields);
               }
            });
         });
      });
   }
}
