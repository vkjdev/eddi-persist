'use strict';
const models = require('./models'),
  sensorsReader = require('./sensors-reader'),
  home = require('./modules/home-communication'),
  formatters = require('./formatters'),
  config = require('./config');

const EDDI_ID = config.id,
  INTERVAL = 5 * 1000;

console.log('eddi-persist starting...');

if( !EDDI_ID ){
  console.error("You must provide an EDDI_ID environment variable.");
  process.exit(1);
}

models.sequelize.sync()
  .then(() => {
    const Reading = models.Reading;
      
    // const socket = net.connect("../eddi-sensors/data/sensors.sock");
    
    setInterval(() => {
      sensorsReader.getAllReadings()
        .then(reading => {
          console.log('this is the reading', reading);
          const firebaseData = formatters.toFirebase(reading),
                sqliteData = formatters.toSqlite(reading);

          // save to sqlite and send to firebase promises
          return Promise.all([
            home.postReading(firebaseData).then(() => console.log('SENT HOME')), // update home with reading
            Reading.create(sqliteData).then(() => console.log('SAVED TO SQLITE'))
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
  })
  .catch(err => console.error('error starting syncing', err));

// log out unhandled errors
const errors = ['uncaughtException', 'unhandledRejection'];

errors.forEach(event => {
  process.on(event, (err, data) => console.error(`${event} received for error`, err));  
});

process.on('exit', () => {
  console.log('process exited');
});