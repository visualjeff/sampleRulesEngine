'use strict';

const { Guber } = require('./data/index');
const { validate } = require('./lib/index');

// Generating fake data for rules engine.  To capture performance we're going use hrtime (node's process high resolution time)
const NS_PER_SEC = 1e9;
let time = process.hrtime();
const payloadSize = 10000;
const payload = Guber.generateFakePayload(payloadSize);
let diff = process.hrtime(time);
console.log(`Generated ${payload.length} records took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
// End of generating fake data


function Metrics(results) {
  Metrics.results.push(results);
}
//Static properties
Metrics.results = [];


const validateRecord = async (facts) => {
  Metrics(await validate(facts));
};

//Custom async forEach function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}

//Iterates over each record then prints results
const init = async (payload) => {
  console.log();
  console.log(`Starting process...`);

  
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
  console.log(`Total Processed Records: ${totalNumberOfRecords} took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  console.log(`  NOTE: ${passed} passed the rules`);
}

//Main entry point
init(payload);


process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

