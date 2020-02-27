#!/usr/bin/env node
  
'use strict';

const Pino = require('pino')();
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;

suite.add('Create the rulesEngine', function() {
}).on('start', function(event) {
    console.log('start invoked');
    let rulesEngine = require('../lib/index');
}).on('cycle', function(event) {
    console.log(String(event.target));
}).on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run();
