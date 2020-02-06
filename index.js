'use strict';

const fs = require('fs');
const serialize = require('serialize-javascript');
const { Rools, Rule } = require('rools');

// Data / input to validate
const facts = {
  user: {
    name: 'frank',
    stars: 347
  },
  weather: {
    temperature: 20,
    windy: true,
    rainy: false
  }
};


// Rule file names
const rulesNames = ['./rules/moodGreat.json', './rules/goWalking.json'];

// This is a custom serializer because we're deserializing function and regex.
const deserialize = (serializedJavascript) => {
  return eval('(' + serializedJavascript + ')');
}

// Load rules
const loadRules = () => {
  return rulesNames.map(name => {
    return new Rule(deserialize(fs.readFileSync(name)));
  });
};

// evaluation using the rules engine
const validate = async (facts, rules = loadRules(), rools = new Rools()) =>  {
  await rools.register(rules);
  await rools.evaluate(facts);
}

// Facts (customer input) will be updated with results from rules engine.
validate(facts).then(() => {
  console.log(facts);
});


