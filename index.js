const net = require('net'),
  Firebase = require('firebase');

const models = require('./models'),
  sensorsReader = require('./sensors-reader'),
  formatters = require('./formatters');

const EDDI_ID = process.env.EDDI_ID || 'test-teddi',
  INTERVAL = 60 * 1000;

if( !EDDI_ID ){
  console.error("You must provide an EDDI_ID environment variable.");
  process.exit(1);
}

models.sequelize.sync()
  .then(() => {
    const readingsDB = new Firebase('https://eddi.firebaseio.com/eddis/' + EDDI_ID + '/readings'),
      Reading = models.Reading;

    // const socket = net.connect("../eddi-sensors/data/sensors.sock");
    
    setInterval(() => {
      sensorsReader.getAllReadings()
        .then(reading => {
          console.log('this is the reading', reading);
          const firebaseData = formatters.toFirebase(reading),
                sqliteData = formatters.toSqlite(reading);
          
          // update firebase promise
          function updateFirebasePromise(data){
            return new Promise((resolve, reject) => {
              readingsDB.update(data, error => {
                if(error) return reject(error);
                resolve();
              });
            })
            .then(() => console.log('SENT TO FIREBASE'));
          }
          
          // save to sqlite and send to firebase promises
          return Promise.all([
            updateFirebasePromise(firebaseData),
            Readings.create(sqliteData).then(() => console.log('SAVED TO SQLITE'))
          ]);
          
        })
        .then(() => console.log('All data saved and sent', new Date().toLocaleString()))
        .catch(error => console.error('error getting reading', error, error.stack));
    
  }, INTERVAL);

    // socket.on("data", function(data){
    //   const dataArray = data.toString().split("|");
    //   const date = dataArray[0],
    //     qOut = parseFloat(dataArray[1]),
    //     qDump = parseFloat(dataArray[2]),
    //     ppmOut = parseInt(dataArray[3]),
    //     ppmIn = parseInt(dataArray[4]),
    //     ppmRec = parseInt(dataArray[5]);

    //   const firebaseData = formatReadingToFirebase(date, qOut, qDump, ppmOut, ppmIn, ppmRec),
    //     sqliteData = formatReadingToSqlite(date, qOut, qDump, ppmOut, ppmIn, ppmRec);

    //   //updates firebase
    //   readingsDB.update(firebaseData, function(error){
    //     if(error) return console.log('ERROR SENDING TO FIREBASE: ', error);
    //     console.log('SENT TO FIREBASE')
    //   });

    //   //updates reading sqlite
    //   Reading.create(sqliteData)
    //     .then(entry => {
    //       console.log('SUCCESS ADDING TO SQLITE: ', entry);
    //     })
    //     .catch(error => {
    //       console.log('ERROR ADDING TO SQLITE: ', error);
    //     });
    // });
  });
