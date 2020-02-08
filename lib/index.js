'use strict';

const fs = require('fs');
const serialize = require('serialize-javascript');
const { Rools, Rule } = require('rools');

// Rule file names
const rulesNames = ['./rules/sampleRule.json'];

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

// Error logging
const delegate = ({ level, message, rule, error }) => {
  console.error(level, message, rule, error);
};

// evaluation using the rules engine
const validate = async (facts, rules = loadRules(), rools = new Rools({
  logging: { error: true, debug: false, delegate },
})) =>  {
  await rools.register(rules);
  return await rools.evaluate(facts);
  //updated lists the names of the fact segments that were actually updated during evaluation. 
  //fired is the number of rules that were fired. 
  //elapsed is the number of milliseconds needed.
}

exports.validate = validate;
exports.reloadRules = loadRules;