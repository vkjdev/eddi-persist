'use strict';
const fsPromises = require('./modules/fs-promises'),
    calculator = require('./modules/calculator');

const BASE = '/sys/devices/12d10000.adc/iio:device0',
    VALUES = {
        flowOut : 'qOut',
        flowRec : 'qDump',
        salinityIn : 'ppmIn',
        salinityOut : 'ppmOut',
        salinityRec : 'ppmRec'
    },
    PINS = {
        a0 : `${BASE}/in_voltage0_raw`,
        a1 : `${BASE}/in_voltage1_raw`,
        a2 : `${BASE}/in_voltage2_raw`,
        a3 : `${BASE}/in_voltage5_raw`,
        a4 : `${BASE}/in_voltage6_raw`,
        a5 : `${BASE}/in_voltage7_raw`,
    },
    READINGS = {
        [VALUES.flowOut] : 'a3',
        [VALUES.flowRec] : 'a4',
        [VALUES.salinityIn]: 'a0',
        [VALUES.salinityOut] : 'a1',
        [VALUES.salinityRec] : 'a2'
    },
    CALCULATOR = {
        [VALUES.flowOut] : count => countToFrequency(count),
        [VALUES.flowRec] : count => countToFrequency(count),
        [VALUES.salinityIn]: raw => rawToPpm(raw),
        [VALUES.salinityOut] : raw => rawToPpm(raw),
        [VALUES.salinityRec] : raw => rawToPpm(raw) 
    };
    
/*
    Flow Sensing
    This will be measured in frequency. A high frequency means that the flow is fast. Slow means flow is low.
    A3(Analog) - output flow sensor.
    A4(Analog) - recirculation flow sensor. The recirculation flow sensor can be used to measure how much water is dumped during dump mode.

    Salinity Sensing
    A high value for this means that the water is very clean. Low values indicate salty water.
    A0(Analog) - intake salinity.
    A1(Analog) - output salinity.
    A2(Analog) - recirculation salinity.
*/
   
   // salinity 0 - 3000 millivolts
   // flow 1000 - 2000 millivolts
   
// Helper functions
function rawToPpm(raw){
    return calculator.voltageToPpm(calculator.rawToMillivolts(raw));
}

function countToFrequency(raw){
    return calculator.rawToMillivolts(raw);
}

// get readings
function getReading(pin){
    const readingPath = pin && PINS[pin.toLowerCase()];
    if(!readingPath) throw new Error(`${pin} is not a valid pin.`);
    return fsPromises.readFile(readingPath);
}

function getAllReadings(){
    const values = [
        'flowOut',
        'salinityIn',
        'salinityOut',
        'salinityRec',
    ],
    getFindings = values
        .map(key => VALUES[key])
        .map(value => {
            const pin = READINGS[value];
            return getReading(pin)
                .then(data => {
                  console.log('type', value, 'raw', data, 'millivolts', calculator.rawToMillivolts(data));
                  return data;
                })
                .then(data => CALCULATOR[value](data))
                .then(calculated => ({ [value] : calculated }));
        });
        
   return Promise.all(getFindings)
        .then(findings => Object.assign.apply(null, [{ date: new Date() }].concat(findings)));
}

module.exports = {
    getReading : getReading,
    getAllReadings : getAllReadings
};