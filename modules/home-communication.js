'use strict';
const superagent = require('superagent');

const config = require('../config');

function postReading(reading){
    const URL = `${config.homeUrl}/${config.id}/readings`;
    return new Promise((resolve, reject) => {
       superagent.post(URL)
                .send(reading)
                .end((err, data) => {
                    if(err) return reject(err);
                    resolve(data);
                });
    });
}

module.exports = {
    postReading : postReading
};
