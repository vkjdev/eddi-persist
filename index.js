var net = require('net');
var Firebase = require('firebase');

var EDDI_ID = process.env.EDDI_ID;
if( !EDDI_ID ){
  console.error("You must provide an EDDI_ID environment variable.");
  process.exit(1);
}

var readingsDB = new Firebase('https://eddi.firebaseio.com/eddis/'+EDDI_ID+'/readings');

var socket = net.connect("../eddi-sensors/data/sensors.sock");

socket.on("data", function(data){
  var dataArray = data.toString().split("|");
  var dataObj = {};
  dataObj[dataArray[0]] = {
    qOut:   parseFloat(dataArray[1]),
    qDump:  parseFloat(dataArray[2]),
    ppmOut: parseInt(dataArray[3]),
    ppmIn:  parseInt(dataArray[4]),
    ppmRec: parseInt(dataArray[5])
  };
  readingsDB.update(dataObj);
});
