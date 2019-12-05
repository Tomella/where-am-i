
class Owner {
   constructor(pool) {
      this.pool = pool;
   }

  async createOrFind(surname, givename, knickname) {
      /*
      	`id` INT(11) NOT NULL AUTO_INCREMENT,
	      `surname` VARCHAR(150) NOT NULL DEFAULT '0',
	      `given_name` VARCHAR(150) NOT NULL DEFAULT '0',
	      `knickname` VARCHAR(150) NOT NULL DEFAULT '0',
	      `create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      */

      return new Promise((resolve, reject) => {
         this.findByKnickname(knickname).then(found => {
            if (found.length) {
               let owner = found[1];
               if (owner.surname !== surname || owner.given_name !== givename) {
                  reject("User already exists with that knickname but names don't match.");
               } else {
                  resolve(owner);
               }
            }
         });
      });
   }

   async findByKnickname(knickname) {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM owner where knickname = ?', [knickname], function (error, results, fields) {
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

module.exports = Owner;