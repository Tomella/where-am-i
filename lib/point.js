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

      let results = await this.pool.query(queryStr, [job, +count]);
      return results[0];
   }

   async getById(id, count = 200) {
      let queryStr = 'SELECT * FROM journal';
      // Is it a
      if (id) {
         queryStr += " where job_id = ?";
      }

      queryStr += " order by time_point desc limit ?"; // Stops malicious sql injection, will throw error

      let results = await this.pool.query(queryStr, [id, +count]);
      return results[0];
   }

   async last() {
      let queryStr = 'SELECT * FROM journal order by time_point desc limit 1';
      let response = await this.pool.query(queryStr);
      return response[0];
   }

   async dateSummary() {
      let queryStr = 'SELECT CAST(time_point AS DATE) as day, COUNT(*) as value FROM journal GROUP BY CAST(time_point AS DATE)';
      return this.query(queryStr);
   }
}
