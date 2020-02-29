'use strict';

const rulesEngine = require('../lib/index.js');
const fs = require('fs');

const isoDateRegEx = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

afterEach(() => {
  //Reset the invocation count on all mocks
  //jest.clearAllMocks();
});

describe('Tesing rules engine', () => {
  it('Testing happy path', async () => {
    rulesEngine.setRules(['./__tests__/rules/sample1a.json', './__tests__/rules/sample1b.json']);
    let testData = fs.readFileSync('./__tests__/data/sample1.json');
    testData = JSON.parse(testData);
    await rulesEngine.validate(testData);
    expect(testData.user.mood).toBe('great');
    expect(testData.goWalking).toBeTruthy();    
  });
  it('Testing happy path using noopRule', async () => {
    rulesEngine.setRules(['./__tests__/rules/noopRule.json']);
    let testData = fs.readFileSync('./__tests__/data/sample2.json');
    testData = JSON.parse(testData);
    await rulesEngine.validate(testData);
    expect(testData.rulesEngineResults).toMatchObject({
      processedAt: expect.stringMatching(isoDateRegEx),
      returnValue: 'Return value from AD',
    });
  });
  it('Testing rule update while processing in flight', async () => {
    rulesEngine.setRules(['./__tests__/rules/slowProcessingRule.json']);
    let testData1 = fs.readFileSync('./__tests__/data/sample2.json');
    testData1 = JSON.parse(testData1);
    const p1 = rulesEngine.validate(testData1);

    rulesEngine.setRules(['./__tests__/rules/noopRule.json']);
    let testData2 = fs.readFileSync('./__tests__/data/sample2.json');
    testData2 = JSON.parse(testData2);
    const p2 = rulesEngine.validate(testData2);

    await Promise.all([p1, p2]);

    expect(testData1.rulesEngineResults).toMatchObject({
      processedAt: expect.stringMatching(isoDateRegEx),
      returnValue: 'Return value from AD',
    });
    expect(testData2.rulesEngineResults).toMatchObject({
      processedAt: expect.stringMatching(isoDateRegEx),
      returnValue: 'Return value from AD',
    });
  });
  it('Testing setting rules and getting rules', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/sample1b.json'];
    rulesEngine.setRules(newRules);
    const rules = rulesEngine.getRules();
    expect(newRules).toEqual(
      expect.arrayContaining(rules),
    );
  });
  it('Testing setting rules.  But with wrong datatype', () => {
    const newRules = {};
    rulesEngine.setRules(newRules);
    const rules = rulesEngine.getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing setting rules with an empty array', () => {
    const newRules = [];
    rulesEngine.setRules(newRules);
    const rules = rulesEngine.getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing bad rules.  No file exist', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/sample1d.json'];
    const rules = rulesEngine.getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing bad rules.  Not valid Javascript', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/badSample.json'];
    const rules = rulesEngine.getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing getting default logging configurations', () => {
    const loggingConfigurations = rulesEngine.getLoggingConfigurations();
    expect(JSON.stringify(loggingConfigurations)).toEqual(JSON.stringify({
      error: true,
      debug: false,
      _delegate: ({ level, message, rule, error }) => {
        console.error(level, message, rule, error);
      }
    }));
  });
  it('Testing setting and getting logging configurations', () => {
    rulesEngine.setLoggingConfigurations({});
    const loggingConfigurations = rulesEngine.getLoggingConfigurations();
    expect(JSON.stringify(loggingConfigurations)).toEqual(JSON.stringify({}));    
  });

});
