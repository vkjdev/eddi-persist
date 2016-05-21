'use strict';

function voltageToPpm(millivolts){
    const salResistorOhms = 1000000,
        ohms = (millivolts / (5000.0 - millivolts)) * salResistorOhms;

	// TODO: Need to test in order to establish constants for the function of resistance to tds

	return ohms / 100;
}

function rawToMillivolts(raw){
    return raw * 2 * 0.439453125; // mV
}

module.exports = {
    rawToMillivolts : rawToMillivolts,
    voltageToPpm : voltageToPpm
};