// INSERT INTO `spatial_test`.`locations` (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));

export default class Journal {
   constructor(pool) {
      this.pool = pool;
   }

   /*
   data: { sat: '15',
  dir: '130.1',
  alt: '192.68121337890625',
  lat: '-34.45571817',
  lon: '138.8107468',
  time: '2019-10-23T23:38:13.000Z',
  s: '0.49' }
   */
   async log(id, data) {
      /*
      	`id` INT(11) NOT NULL AUTO_INCREMENT,
	      `latitude` DOUBLE NOT NULL DEFAULT '0',
	      `job_id` INT(11) NOT NULL DEFAULT '0',
	      `longitude` DOUBLE NOT NULL DEFAULT '0',
	      `elevation` DOUBLE NOT NULL DEFAULT '0',
	      `satellites` INT(11) NOT NULL DEFAULT '0',
	      `accuracy` DOUBLE NULL DEFAULT '0',
	      `location` POINT NOT NULL,
      */
      const details = {
         latitude: +data.lat,
         longitude: +data.lon,
         job_id: id,
         elevation: +data.alt,
         satellites: +data.sat,
         time_point: new Date(data.time),
         accuracy: data.acc ? +data.acc : 1,
         location: new Location(+data.lat, +data.lon)
      };

      // INSERT IGNORE INTO journal (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));
      let results = this.pool.query('INSERT IGNORE INTO journal SET ?', details);
      return results[0];
   }

   async updateDem(id, dem) {
      let results = await this.pool.query('UPDATE journal SET ? WHERE id = ' + id, {dem});
      return results[0];
   }

   async all() {
      let results = await this.pool.query('SELECT * FROM journal order by time_point');
      return results[0];
   }

   async countsByDay() {
      let results = await this.pool.query('SELECT DATE(time_point) AS date_point, COUNT(*) AS total, ' +
         'min(latitude) as minlat, max(latitude) as maxlat, min(longitude) as minlng, max(longitude) as maxlng ' +
         'from journal GROUP BY date_point ORDER BY date_point');
      console.log("What")
      let map = results[0].reduce((acc, entry) => {
         let date = entry.date_point;

         let dateStr = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, 0) + "-" + String(date.getDate()).padStart(2, 0);
         delete entry.date_point;
         acc[dateStr] = entry;
         return acc;
      }, {});
      return map;
   }

   async pageNeedingDem(count = 2000) {
      let results = await this.pool.query('SELECT * FROM journal where dem < -9000  order by id asc limit ?', [count]);
      return results[0];
   }
}

class Location {
   constructor(lat, long) {
      this.lat = lat;
      this.long = long;
   }
   toSqlString() {
      return 'POINT(' + [this.long, this.lat].join(', ') + ')';
   }
}

