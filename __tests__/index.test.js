'use strict';

const { Guber } = require('../data/index');
const { validate, setRules, reloadRules } = require('../lib/index');
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
});
