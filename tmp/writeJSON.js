'use strict';

const fs = require('fs');
const serialize = require('serialize-javascript');


//Example of how to serialize out json that includes functions definitions.
const moodGreat = {
  name: 'mood is great if 200 stars or more',
  when: (facts) => facts.user.stars >= 200,
  then: (facts) => {
    facts.user.mood = 'great';
  },
};

const goWalking = {
  name: 'go for a walk if mood is great and the weather is fine',
  when: [
    (facts) => facts.user.mood === 'great',
    (facts) => facts.weather.temperature >= 20,
    (facts) => !facts.weather.rainy,
  ],
  then: (facts) => {
    facts.goWalking = true;
  },
};
 
fs.writeFileSync('moodgreat.json', serialize(moodGreat, {space: 2}));
fs.writeFileSync('gowalking.json', serialize(goWalking, {space: 2}));

console.log('All done');
