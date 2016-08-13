'use strict';
const home = require('../modules/home-communication'),
    formatters = require('../formatters');

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(){
    const data = {
        qOut : randomInt(2, 4),
        ppmOut : randomInt(1000, 2000),
        ppmIn : randomInt(3500, 4500),
        ppmRec : randomInt(1000, 2000),
        // ppmOut : randomInt(5000, 12000),
        // ppmIn : randomInt(6500, 9500),
        // ppmRec : randomInt(2000, 4000),
        date: new Date() 
    },
    formattedData = formatters.toFirebase(data);
    console.log('formatted', formattedData);
    return formattedData;
}

setInterval(() => {
    home.postReading(generateData())
        .then(() => console.log('success'))
        .catch(err => console.error(err));
}, 15 * 1000);