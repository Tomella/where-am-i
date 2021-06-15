
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

module.exports = Job;
