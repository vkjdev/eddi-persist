'use strict';

const MAX_SALINITY = 100000;
const A_N = 11483;
const B_N = -1.7373;
// These are calculated from a power law least squares fit on actual readings of known salinity;
// http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html

function voltageToPpm(millivolts){
    const resistance = ((10000 / (millivolts / 1000)) - 2000) / 1000,
        salinity = 257396 * Math.pow(resistance, -1.72);
    console.log('millivolts', millivolts, 'resistance', resistance, 'salinity', salinity);
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
