const argv = require('yargs').argv;
const X2JS = require('x2js');
const fs = require('fs');
const config = require("../lib/config");
const http = require('https');
const querystring = require('querystring');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

run().then(() => {
   console.log("Finit");
});


async function run() {
   x2js = new X2JS();

   let file = argv.file;
   console.log(file);

   if (!file) {
      console.log('Provide a filename like --file=fred.gpx');
      return true;
   } else if (!fs.existsSync(file)) {
      console.log('The file: ' + file + ' does\'s not exist.');
      return true;
   } else {
      let data = await readFileAsync(file);
      let track = x2js.xml2js(data.toString());
      if (!track || !track.gpx || !track.gpx.trk || !track.gpx.trk.trkseg || !track.gpx.trk.trkseg.trkpt) {
         console.log("That document is not like what was expected (gpx/trk/trkseg/trkpt).");
      } else {
         /*
           from
               ele: '196.0628662109375',
               time: '2019-10-23T23:17:51.000Z',
               course: '160.8',
               speed: '0.59',
               geoidheight: '-2.2',
               src: 'gps',
               sat: '17',
               hdop: '0.6',
               vdop: '0.7',
               pdop: '0.9',
               _lat: '-34.45581543',
               _lon: '138.81123645'
              to
               sat: '7',
               dir: '0.0',
               acc: '20.368000030517578',
               alt: '186.02197265625',
               lat: '-34.45576642',
               lon: '138.81077089',
               time: '2019-10-23T22:49:20.000Z',
               s: '0.0'
            */
         let records = track.gpx.trk.trkseg.trkpt.filter(e => e.src === "gps" && e.sat !== '0').map(({ sat, course, _lat, _lon, ele, time, speed }) => ({
            sat: +sat,
            dir: +course,
            alt: +ele,
            lat: +_lat,
            lon: +_lon,
            time,
            s: +speed
         }));

         for (const record of records) {
            const contents = await httpIt(record);
            //console.log(contents);
         }
      }

   }
}

async function httpIt(parameters) {
   const get_request_args = querystring.stringify(parameters);

   const url = config.loggingUrl + get_request_args;

   return new Promise(function (resolve, reject) {
      http.get(url, (res) => {
         resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
         });
      });
   });
}