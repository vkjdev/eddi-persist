'use strict';
module.exports = {
    id : process.env.EDDI_ID || 'test-teddi',
    homeUrl : process.env.HOME_URL ||  'http://eddisystems.herokuapp.com/device' || 'localhost:3000/device'
};