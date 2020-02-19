'use strict';

const fs = require('fs');
const { Rools, Rule } = require('rools');

// Rule file names
let rulesNames = ['./rules/sampleRule.json'];

/**
 * Setter
 *
 * @param {Array} - An array of rules
 */
const setRules = (rules) => {
  if (Array.isArray(rules) && rules.length > 0) {
    //Does each file exist and is it valid Javascript
    rules.forEach(rule => {
      fs.existsSync(rule);
      _deserialize(fs.readFileSync(rule));
    });

    rulesNames = rules;
  }
}

/**
 * Getter
 *
 * @returns {Array} - An array of rules
 */
const getRules = () => {
  return rulesNames;
}

// This is a custom serializer because we're deserializing function and regex.
const _deserialize = (serializedJavascript) => {
  return eval('(' + serializedJavascript + ')');
}

/**
 * Reloads the rules the have been set.
 */
const loadRules = () => {
  return rulesNames.map(name => {
    return new Rule(_deserialize(fs.readFileSync(name)));
  });
};

/* istanbul ignore next */
const delegate = ({ level, message, rule, error }) => {
  console.error(level, message, rule, error);
};

/**
 * Validates facts by applying the rules.
 *
 * @param {facts} - data for validation
 */
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
exports.setRules = setRules;
exports.getRules = getRules;
