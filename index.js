var net = require('net');

var socket = net.connect("../eddi-sensors/data/sensors.sock");

socket.on("data", function(data){
  console.log(data);
});
