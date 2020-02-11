'use strict';

const { Guber } = require('../data/index');
const { validate, setRules, getRules, reloadRules } = require('../lib/index');
const fs = require('fs');

afterEach(() => {
  //Reset the invocation count on all mocks
  jest.clearAllMocks();
});

describe('Tesing rules engine', () => {
  it('Testing happy path', async () => {
    setRules(['./__tests__/rules/sample1a.json', './__tests__/rules/sample1b.json']);
    let testData = fs.readFileSync('./__tests__/data/sample1.json');
    testData = JSON.parse(testData);
    await validate(testData);
    expect(testData.user.mood).toBe('great');
    expect(testData.goWalking).toBeTruthy();    
  });
  it('Testing setting rules and getting rules', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/sample1b.json'];
    setRules(newRules);
    const rules = getRules();
    expect(newRules).toEqual(
      expect.arrayContaining(rules),
    );
  });
  it('Testing setting rules.  But with wrong datatype', () => {
    const newRules = {};
    setRules(newRules);
    const rules = getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing setting rules with an empty array', () => {
    const newRules = [];
    setRules(newRules);
    const rules = getRules();
    expect.arrayContaining(['./rules/sampleRule.json']);
  });
  it('Testing bad rules.  No file exist', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/sample1d.json'];
    expect(() => {
      setRules(newRules);
    }).toThrow();  
  });
  it('Testing bad rules.  Not valid Javascript', () => {
    const newRules = ['./__tests__/rules/sample1a.json', './__tests__/rules/badSample.json'];
    expect(() => {
      setRules(newRules);
    }).toThrow();  
  });
});
