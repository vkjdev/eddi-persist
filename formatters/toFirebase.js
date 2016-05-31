'use strict';
const POSSIBLES = {
    qOut : 'qOut',
    qDump : 'qDump',
    ppmOut : 'ppmOut',
    ppmIn : 'ppmIn',
    ppmRec : 'ppmRec'    
};

// NEW
function getDate(date){
    if(date instanceof Date) return date.getTime() / 1000;
    else if(typeof date === 'number') return date;
    else if(typeof date === 'string') return new Date(date) / 1000;
    else throw new Error('Valid date needs to be provided.');
}

function formatReadingToFirebase(reading){
    reading = reading || {};
    const dateInput = reading.date || new Date(),
        formattedDate = getDate(dateInput),
        data = Object.keys(reading).reduce((accum, key) => {
            const dataKey = POSSIBLES[key];
            if(dataKey) accum[dataKey] = reading[key];
            return accum;
        }, {});
    
    return {
        [formattedDate] : data
    };
}

// OLD
// function formatReadingToFirebase(date, qOut, qDump, ppmOut, ppmIn, ppmRec){
//     const data = {};
    
//     // get epoch time
//     let epoch;
//     if(date instanceof Date) epoch = date.getTime() / 1000;
//     else if(typeof date === 'number') epoch = date;
//     else if(typeof date === 'string') epoch = new Date(date) / 1000;
//     else throw new Error('Valid date needs to be provided.');

//     // set up firebase data structure
//     data[epoch] = {
//         qOut,
//         qDump,
//         ppmOut,
//         ppmIn,
//         ppmRec
//     };
    
//     return data;
// };

module.exports = formatReadingToFirebase;

    