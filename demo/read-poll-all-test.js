'use strict';
const calculator = require('../sensors-reader/modules/calculator'),
    fsPromises = require('../sensors-reader/modules/fs-promises');

const BASE = '/sys/devices/12d10000.adc/iio:device0',
    PINS = {
        a0 : `${BASE}/in_voltage0_raw`,
        a1 : `${BASE}/in_voltage1_raw`,
        a2 : `${BASE}/in_voltage2_raw`,
        a3 : `${BASE}/in_voltage5_raw`,
        a4 : `${BASE}/in_voltage6_raw`,
        a5 : `${BASE}/in_voltage7_raw`,
    },
    INTERVAL = 5 * 1000;

// get readings
function getReading(pin){
    const readingPath = pin && PINS[pin.toLowerCase()];
    if(!readingPath) throw new Error(`${pin} is not a valid pin.`);
    return fsPromises.readFile(readingPath);
}

setInterval(() => {
    Object.keys(PINS).forEach(pin => {
        getReading(pin)
            .then(raw => {
                console.log('pin', pin, 'raw', raw, 'calculated', calculator.rawToMillivolts(raw));
            })
            .catch(err => console.error('got an error', err));
    });

}, INTERVAL);