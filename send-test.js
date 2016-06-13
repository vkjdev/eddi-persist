'use strict';
const home = require('./modules/home-communication'),
    formatters = require('./formatters');

const data = {
    qOut : 3,
    ppmOut : 2000,
    ppmIn : 5000,
    ppmRec : 1000,
    date: new Date() 
},
formattedData = formatters.toFirebase(data);

home.postReading(formattedData)
    .then(() => console.log('success'))
    .catch(err => console.error(err));