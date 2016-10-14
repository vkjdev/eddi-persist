'use strict';
const sensorReader = require('../sensors-reader');

const pin = process.argv[2];

sensorReader.getReading(pin)
    .then(reading => console.log(`this is the reading for pin ${pin}`, reading))
    .catch(error => console.error('this is the error', error, error.stack));