'use strict';

function voltageToPpm(millivolts){
    const resistance = 10 / ((5 / (millivolts / 1000)) - 1),
        salinity = 257300 * Math.pow(resistance, -1.72);

	// TODO: Need to test in order to establish constants for the function of resistance to tds

    // if salinity is zero, set it to a really high number
	return Object.is(salinity, Infinity) ? 100000 : salinity;
}

function rawToMillivolts(raw){
    return raw * 2 * 0.439453125; // mV
}

module.exports = {
    rawToMillivolts : rawToMillivolts,
    voltageToPpm : voltageToPpm
};