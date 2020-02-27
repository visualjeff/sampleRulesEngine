'use strict';

const fs = require('fs');
const { Rools, Rule } = require('rools');

module.exports = (function() {
  const _MAX_NUMBER_FILES = process.env.MAX_NUMBER_FILES || 10; 
  const _MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 100000;

  //Rools logging configuration
  let _loggingConfigurations = { 
    error: true, 
    debug: false, 
    _delegate: ({ level, message, rule, error }) => {
      console.error(level, message, rule, error);
    }
  };

  //TODO: Could add a rule path?  If path is provided at startup load all of the JSON files within the directory.
  let _ruleNames = ['./rules/sampleRule.json'];

  const _deserialize = (serializedJavascript) => {
    return eval('(' + serializedJavascript + ')');
  };

  const _loadRules = () => {
    return _ruleNames.map(name => {
      return new Rule(_deserialize(fs.readFileSync(name)));
    });
  };
  
  const _getFileSize = (filename) => {
    return fs.statSync(filename).size;
  };

  const _formatBytes = (bytes, decimals) => {
    if(bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const _validateFileSize = (rule) => {
    if (_getFileSize(rule) > _MAX_FILE_SIZE) { //100 KB
      throw new Error(`File ${rule} is over the size limit.  ${rule} is ${_formatBytes(_getFileSize(rule))} in size.`);  
    }
  };


  return Object.freeze({
    setRules: function(rules) {
      if (Array.isArray(rules) && rules.length > 0 && rules.length < _MAX_NUMBER_FILES) {
        try {
          rules.forEach(rule => {
            fs.existsSync(rule);
            _validateFileSize(rule);
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
  });
})();
