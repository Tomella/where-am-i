const JOB_DETAILS_QUERY = `SELECT 
job.*, 
MAX(journal.time_point) AS last_date,
COUNT(job_id) as points, 
MAX(journal.latitude) AS maxy, 
MIN(journal.latitude) AS miny, 
MAX(journal.longitude) AS maxx, 
MIN(journal.longitude) AS minx 
FROM journal
LEFT JOIN job ON job.id = journal.job_id
WHERE job.id = ?`;

const ALL_QUERY = `SELECT 
job.*, 
MAX(journal.time_point) AS last_date,
COUNT(job_id) as points, 
MAX(journal.latitude) AS maxy, 
MIN(journal.latitude) AS miny, 
MAX(journal.longitude) AS maxx, 
MIN(journal.longitude) AS minx 
FROM journal
LEFT JOIN job ON job.id = journal.job_id
GROUP BY job_id
ORDER BY last_date`


export default class Job {
   constructor(pool) {
      this.pool = pool;
   }

   async all() {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query(ALL_QUERY, function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(results, fields);
               }
            });
         });
      });
   }

   async findById(id) {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query(JOB_DETAILS_QUERY, [id], function (error, results, fields) {
               connection.release();
               console.log(results);
               if (error) reject(error);
               else {
                  if(results.length) {
                     resolve(results[0], fields);
                  } else {
                     resolve(null, fields);
                  }
               }
            });
         });
      });
   }

   async exists(name) {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM job where name = ?', [name], function (error, results, fields) {
               connection.release();
               console.log(results);
               if (error) reject(error);
               else {
                  resolve(results && results.length > 0, fields);
               }
            });
         });
      });
   }

   async create(name) {
      let exists = await this.exists(name);
      if(exists) {
         console.log("It exists");
         return true;
      }

      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {

            connection.query('INSERT IGNORE INTO job SET name = ?', [name], function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(true, fields);
               }
            });
         });
      });
   }
}
