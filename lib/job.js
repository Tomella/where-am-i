
class Job {
   constructor(pool) {
      this.pool = pool;
   }

   async all() {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM job', function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(results, fields);
               }
            });
         });
      });
   }

   async create() {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM job', function (error, results, fields) {
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

module.exports = Job;