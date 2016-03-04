const net = require('net'),
  Firebase = require('firebase');

const models = require('./models');

const EDDI_ID = process.env.EDDI_ID;
if( !EDDI_ID ){
  console.error("You must provide an EDDI_ID environment variable.");
  process.exit(1);
}

models.sequelize.sync()
  .then(() => {
    const readingsDB = new Firebase('https://eddi.firebaseio.com/eddis/' + EDDI_ID + '/readings'),
      Reading = models.Reading;

    const socket = net.connect("../eddi-sensors/data/sensors.sock");

    function formatReadingToFirebase(date, qOut, qDump, ppmOut, ppmIn, ppmRec){
      const data = {};
      data[date] = {
        qOut,
        qDump,
        ppmOut,
        ppmIn,
        ppmRec
      };
      return data;
    }

    function formatReadingToSqlite(date, qOut, qDump, ppmOut, ppmIn, ppmRec){
      return {
        date: new Date(date*1000),
        qOut: qOut,
        qDump: qDump,
        ppmOut: ppmOut,
        ppmIn: ppmIn,
        ppmRec: ppmRec
      };
    }

    socket.on("data", function(data){
      const dataArray = data.toString().split("|");
      const date = parseInt(dataArray[0]),
        qOut = parseFloat(dataArray[1]),
        qDump = parseFloat(dataArray[2]),
        ppmOut = parseInt(dataArray[3]),
        ppmIn = parseInt(dataArray[4]),
        ppmRec = parseInt(dataArray[5]);

      const firebaseData = formatReadingToFirebase(date, qOut, qDump, ppmOut, ppmIn, ppmRec),
        sqliteData = formatReadingToSqlite(date, qOut, qDump, ppmOut, ppmIn, ppmRec);

      //updates firebase
      readingsDB.update(firebaseData, function(error){
        if(error) return console.log('ERROR SENDING TO FIREBASE: ', error);
        console.log('SENT TO FIREBASE')
      });

      //updates reading sqlite
      Reading.create(sqliteData)
        .then(entry => {
          console.log('SUCCESS ADDING TO SQLITE: ', entry);
        })
        .catch(error => {
          console.log('ERROR ADDING TO SQLITE: ', error);
        });
    });
  });
