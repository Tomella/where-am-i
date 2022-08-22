
export default class Owner {
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

      let found = await this.findByKnickname(knickname);
      if (found.length) {
         let owner = found[1];
         if (owner.surname !== surname || owner.given_name !== givename) {
            throw new Error("User already exists with that knickname but names don't match.");
         } else {
            return owner;
         }
      }
   }

   async findByKnickname(knickname) {
      let results = this.pool.query('SELECT * FROM owner where knickname = ?', [knickname]);
      return results[0];
   }
}