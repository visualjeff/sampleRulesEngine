# Sample implementation of a rules engine

Project uses (https://www.npmjs.com/package/rools)[https://www.npmjs.com/package/rools] for the rules engine.

## Pre-req

Nodejs v10.x.x and above

## Setup

```
npm install
```

## Running
```
node index.js
```

## Sample input
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
