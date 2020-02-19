'use strict';

const fs = require('fs');
const { Rools, Rule } = require('rools');

module.exports = (function() {
  let _loggingConfigurations = { 
    error: true, 
    debug: false, 
    _delegate: ({ level, message, rule, error }) => {
      console.error(level, message, rule, error);
    }
  };

  let _ruleNames = ['./rules/sampleRule.json'];

  const _deserialize = (serializedJavascript) => {
    return eval('(' + serializedJavascript + ')');
  }

  const _loadRules = () => {
    return _ruleNames.map(name => {
      return new Rule(_deserialize(fs.readFileSync(name)));
    });
  };

  return {
    setRules: function(rules) {
      if (Array.isArray(rules) && rules.length > 0) {
        try {
          rules.forEach(rule => {
            fs.existsSync(rule);
            _deserialize(fs.readFileSync(rule));
          });
          _ruleNames = rules;
        } catch(error) {
          console.log(`Failed to load rules: ${error.message}`);
        }
      }
    },
    getRules: function() {
      return _ruleNames;
    },
    setLoggingConfigurations: function(configs = _loggingConfigurations) {
      _loggingConfigurations = configs;
    },
    getLoggingConfigurations: function() {
      return _loggingConfigurations;
    },
    validate: async function(facts, rules = _loadRules(), rools = new Rools({
        logging: _loggingConfigurations,
      })) {
        await rools.register(rules);
        return await rools.evaluate(facts);
      }
  }
})();
