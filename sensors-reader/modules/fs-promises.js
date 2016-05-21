'use strict';
const fs = require('fs');

function readFile(filePath){
    const options = {
        encoding : 'utf8'    
    };
    
    return new Promise((resolve, reject) => {
        fs.readFile(
            filePath,
            options,
            (err, data) => {
                if(err) return reject(err);
                resolve(data);
            }
        );
    })
}

module.exports = {
    readFile : readFile
};