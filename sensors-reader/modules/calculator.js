'use strict';

const MAX_SALINITY = 100000;

function voltageToPpm(millivolts){
    const resistance = 10 / ((5 / (millivolts / 1000)) - 1),
        salinity = 257300 * Math.pow(resistance, -1.72);

	// TODO: Need to test in order to establish constants for the function of resistance to tds

    // if salinity is Infinite, set it to a really high number
    if( Object.is(salinity, Infinity) ){
    	return MAX_SALINITY;
    } else {
    	return Math.min(MAX_SALINITY, salinity);
    }
}

function rawToMillivolts(raw){
    return raw * 2 * 0.439453125; // mV
}

module.exports = {
    rawToMillivolts : rawToMillivolts,
    voltageToPpm : voltageToPpm
};
