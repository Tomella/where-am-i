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
        console.log("CAched: ", elevation);
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
        let [results] = await this.pool.query(LOAD, [lat, lng]);
        return results.length ? results[0].elevation : null;
    }

    async store(latitude, longitude, elevation) {
        await this.pool.query('INSERT INTO demcache SET ?',  { latitude, longitude, elevation});
        return elevation;
    }

    async load(lat, lng) {
        const url = this.config.template.replace("$lat", lat).replace("$lng", lng);
        const res = await fetch(url);
        const json = await res.json();

        let height = null;
        if(json) {
            height = json["HEIGHT AT LOCATION"];
            if(height) {
                let val = this.config.responseMappings[height];
                if(val) {
                    height = val;
                }
            }
        }
        return !isNaN(height) ? +height : null;
    }

    async getAll(lat, lng) {
        let [results] = await this.pool.query("select * from demcache ORDER BY longitude, latitude", [lat, lng]);
        return results.map(x => [+x.longitude, +x.latitude, +x.elevation]);
    }
}