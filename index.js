var net = require('net');

var socket = net.connect("../eddi-sensors/data/sensors.socket");

socket.on("data", function(data){
  console.log(data);
});
