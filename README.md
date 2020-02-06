# Sample implementation of a rules engine

Project uses [https://www.npmjs.com/package/rools](https://www.npmjs.com/package/rools) for the rules engine.

## Pre-req

[Nodejs](https://nodejs.org/en/) v10.x.x and above

## Setup

```
npm install
```

## Running
```
node index.js
```

## Sample input (in index.js)
```
{
  user: {
    name: 'frank',
    stars: 347
  },
  weather: {
    temperature: 20,
    windy: true,
    rainy: false
  }
}
```

## Sample Output (JSON is updated by rules engine)

Rules engine added a mood property and goWalking property because the rules were satisfied
```
{ 
  user: { 
    name: 'frank', 
    stars: 347, 
    mood: 'great'
  },
  weather: { 
    temperature: 20, 
    windy: true, 
    rainy: false 
  },
  goWalking: true 
}
```

## Rules reside in the directory ./rules and are JSON files.
```
{
  "name": "mood is great if 200 stars or more",
  "when": (facts) => facts.user.stars >= 200,
  "then": (facts) => {
    facts.user.mood = 'great';
  }
}
```

```
{
  "name": "go for a walk if mood is great and the weather is fine",
  "when": [
    (facts) => facts.user.mood === 'great',
    (facts) => facts.weather.temperature >= 20,
    (facts) => !facts.weather.rainy
  ],
  "then": (facts) => {
    facts.goWalking = true;
  }
}
```

## TODO
1. Autoreload rules when changed
2. Proper error handling and logging
3. Benchmark performance
4. Create a test suite
