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
      let results = await this.pool.query(ALL_QUERY);
      return results[0]; //  0 : results, 1: fields
   }

   async findById(id) {
      let [results] = await this.pool.query(JOB_DETAILS_QUERY, [id]);
      return (results.length)? results[0] : null;
   }

   async findByName(name) {
      let [results] = await this.pool.query('SELECT * FROM job where name = ?', [name]);
      return (results.length)? results[0] : null;
   }

   async exists(name) {
      let results = await this.findByName(name);
      return results !== null;
   }

   async create(name) {
      let exists = await this.findByName(name);
      if(exists) {
         console.log("It exists", exists);
         return exists.id;
      }

      exists = await this.pool.query('INSERT IGNORE INTO job SET name = ?', [name]);
      if(exists[0] && exists[0].insertId) {
         console.log("Returning new obj");
         return exists[0].insertId;
      }
      return null;
   }
}
