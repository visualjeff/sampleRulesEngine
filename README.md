# Sample implementation of a rules engine

Project uses [https://www.npmjs.com/package/rools](https://www.npmjs.com/package/rools) for the rules engine.

## Pre-req

[Nodejs](https://nodejs.org/en/) v10.x.x and above.

NOTE: On Windows 10 device use a Git Bash session to run the commands below.  Additionally if you're using a corporate device you'll be challenged by the corporate proxy when installing dependencies.  The following npm commands will resolve this issue:

```
npm config set registry http://registry.npmjs.org/
npm config set strict-ssl false
```

## Setup (install dependencies)

```
npm install
```

## Running (exercise the rules engine)
```
npm start
```

## Testing (run the test suite)

```
npm test
```


## FAQ

Rules reside in the ./rules directory.

The Rules engine resides in the ./lib directory.


## TODO
1. Reload rules while validations are in flight.
