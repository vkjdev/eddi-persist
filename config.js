'use strict';
module.exports = {
    id : process.env.EDDI_ID || 'geoff-eddi',
    homeUrl : process.env.HOME_URL || 'localhost:3000/device' ||  'http://eddisystems.herokuapp.com/device'
};