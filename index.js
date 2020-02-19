'use strict';

const { Guber } = require('./data/index');
const rulesEngine = require('./lib/index');

const chalk = require('chalk');

// Generating fake data for rules engine.  To capture performance we're going use hrtime (node's process high resolution time)
let time = process.hrtime();
const payloadSize = 10000;
const payload = Guber.generateFakePayload(payloadSize);
let diff = process.hrtime(time);
console.log(`Generated ${chalk.green(payload.length)} unique records took ${chalk.green((diff[0]*1000) + (diff[1] / 1000000))} ms`);
// End of generating fake data


//Function captures metrics from rules engine
function Metrics(results) {
  Metrics.results.push(results);
}
//Static properties
Metrics.results = [];


//Invoke validate and capture the resulting metrics
const validateRecord = async (facts) => {
  Metrics(await rulesEngine.validate(facts));
};

//Custom async forEach function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}

//Iterates over records then print results (including metrics)
const init = async (payload) => {
  console.log();
  console.log(`Starting process to run ${chalk.green(payloadSize)} records through the rules engine...`);
  
  let time = process.hrtime();
  await asyncForEach(payload, validateRecord);
  //console.log(`  Results: ${JSON.stringify(Metrics.results, null, 2)}`);
  console.log(`Process complete!`);  
  let diff = process.hrtime(time);
 
  const totalNumberOfRecords = Metrics.results.length;
  let passed = 0;
  Metrics.results.forEach((result) => {
    const { updated, fired, elapsed } = result;
    if (updated && updated.length > 0){
      passed++;
    }   
  });
  console.log('');
  console.log(`Processing of ${chalk.green(totalNumberOfRecords)} records took ${chalk.green((diff[0]*1000) + (diff[1] / 1000000))} ms`);
  console.log(`  NOTE: ${chalk.green(passed)} passed the rules`);
}

//Main entry point
init(payload);


process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

