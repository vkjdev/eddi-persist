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
    if(date instanceof Date) return date;
    else if(typeof date === 'number') return new Date(date * 1000); // epoch time
    else if(typeof date === 'string') return  new Date(date);
    else throw new Error('Valid date needs to be provided.');
}

function formatReadingToSqlite(reading){
    reading = reading || {};
    const dateInput = reading.date || new Date(),
        formattedDate = getDate(dateInput),
        data = Object.keys(reading).reduce((accum, key) => {
            const dataKey = POSSIBLES[key];
            if(dataKey) accum[dataKey] = reading[key];
            return accum;
        }, {});
    return Object.assign({ date : formattedDate}, data);
}

// OLD
// function formatReadingToSqlite(date, qOut, qDump, ppmOut, ppmIn, ppmRec){
//     let dateObj;
    
//     if(date instanceof Date) dateObj = date;
//     else if(typeof date === 'number') dateObj = new Date(date * 1000); // epoch time
//     else if(typeof date === 'string') dateObj = new Date(date);
//     else throw new Error('Valid date needs to be provided.');
    
//     return {
//     // date: new Date(date*1000), // for old eddi-sensors
//         date : dateObj,
//         qOut: qOut,
//         qDump: qDump,
//         ppmOut: ppmOut,
//         ppmIn: ppmIn,
//         ppmRec: ppmRec
//     };
// }



module.exports = formatReadingToSqlite;