'use strict';
const sensorReader = require('../sensors-reader');

sensorReader.getAllReadings()
    .then(reading => console.log('this is the reading', reading))
    .catch(error => console.error('error getting reading', error, error.stack));