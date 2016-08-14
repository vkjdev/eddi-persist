'use strict';

const A_N = 11483;
const B_N = -1.7373;
// calculated via an inverse of the Power Law of Least Squares Fitting
// http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html

function voltageToPpm(millivolts){
    const salResistorOhms = 1000000,
        ohms = (millivolts / (5000.0 - millivolts)) * salResistorOhms;

	// TODO: Need to test in order to establish constants for the function of resistance to tds
    

    return A_N * Math.pow(ohms, B_N);
}

function rawToMillivolts(raw){
    return raw * 2 * 0.439453125; // mV
}

module.exports = {
    rawToMillivolts : rawToMillivolts,
    voltageToPpm : voltageToPpm
};
