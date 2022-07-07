const argv = require('yargs').argv;
const fs = require('fs');
const config = require("../lib/config");
const http = require('https');
const querystring = require('querystring');

run().then(() => {
   console.log("Finit");
});


async function run() {
   let file = argv.file;
   console.log(file);

   let job = argv.job;
   job = job ? job : config.defaultJobname;


   if (!file) {
      console.log('Provide a filename like --file=fred.gpx');
      return true;
   } else if (!fs.existsSync(file)) {
      console.log('The file: ' + file + ' does\'s not exist.');
      return true;
   } else {
      let records = require(file);

      //console.log(records);
      for (const record of records) {
         const contents = await httpIt(job, record);
         //console.log(contents);
      }
   }
}

async function httpIt(job, parameters) {
   const get_request_args = querystring.stringify(parameters);

   const url = config.loggingUrl.replace("{jobName}", job) + get_request_args;

   return new Promise(function (resolve, reject) {
      http.get(url, (res) => {
         resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
         });
      });
   });
}