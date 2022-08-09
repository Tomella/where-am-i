import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

import fs from "fs";
import config from "../lib/config.js";
import http from "https";

await run();
console.log("Finit");

async function run() {
   let file = argv.file;
   console.log(file);

   let job = argv.job;
   job = job ? job : config.defaultJobname;


   if (!file) {
      console.log('Provide a filename like --file=fred.json');
      return true;
   } else if (!fs.existsSync(file)) {
      console.log('The file: ' + file + ' does\'s not exist.');
      return true;
   } else {
      let records = JSON.parse(fs.readFileSync(file));

      //console.log(records);
      for (const record of records) {
         const contents = await httpIt(job, record);
         //console.log(contents);
      }
   }
}

async function httpIt(job, parameters) {
   const get_request_args = new URLSearchParams(parameters).toString();

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