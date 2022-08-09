import fetch from 'node-fetch';

const LOAD = "SELECT elevation FROM demcache WHERE latitude = cast(? as DECIMAL(8,5)) and longitude = cast(? as DECIMAL(8,5));"
const INSERT = 'INSERT IGNORE INTO demcache SET ?'

export default class Elevation {
    constructor(pool, config) {
        this.config = config;
        this.pool = pool;
    }

    async get(lat, lng) {
        console.log("get(lat, lng)", lat, lng)
        let elevation = await this.getCached(lat, lng);
        if(elevation !== null) return elevation;
        elevation = await this.load(lat, lng);
        if(elevation !== null) {
            return this.store(lat, lng, elevation);
        } else {
            console.log("All in failure.")
            return elevation;     
        }   
    }

    async getCached(lat, lng) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                connection.query(LOAD, [lat, lng], function (error, results, fields) {
                    connection.release();
                    if (error) reject(error);
                    else {
                        if(results.length) {
                            resolve(results[0].elevation);
                            console.log("Hit: ", results[0].elevation)
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
/*
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
*/
    async store(latitude, longitude, elevation) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                connection.query('INSERT INTO demcache SET ?',  { latitude, longitude, elevation}, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log(error);
                    }
                    resolve(elevation)
                });
            });
        });
    }

    async load(lat, lng) {
        const url = this.config.template.replace("$lat", lat).replace("$lng", lng);
        const res = await fetch(url);
        const json = await res.json();

        return json && json["HEIGHT AT LOCATION"] && !isNaN(+json["HEIGHT AT LOCATION"]) ? +json["HEIGHT AT LOCATION"] : null;
    }

}