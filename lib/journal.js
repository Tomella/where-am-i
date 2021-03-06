// INSERT INTO `spatial_test`.`locations` (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));

class Journal {
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
   async log(job, data) {
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
         job_id: job.id,
         elevation: +data.alt,
         satellites: +data.sat,
         time_point: new Date(data.time),
         accuracy: data.acc ? +data.acc : 1,
         location: new Location(+data.lat, +data.lon)
      };

      return new Promise((resolve, reject) => {
         // INSERT IGNORE INTO journal (`id`, `coordinates`) VALUES (NULL, GeomFromText('POINT(40.782710 -73.965310)'));
         this.pool.getConnection(function (err, connection) {
            connection.query('INSERT IGNORE INTO journal SET ?', details, function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else resolve(results, fields);
            });
         });
      });
   }

   async all() {
      return new Promise((resolve, reject) => {
         this.pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM journal', function (error, results, fields) {
               connection.release();
               if (error) reject(error);
               else {
                  resolve(results);
               }
            });
         });
      });
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

module.exports = Journal;
