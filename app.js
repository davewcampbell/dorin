'use strict';


var express = require('express')
var app = express()

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

app.get("/", function(req, res){
	console.log('Received - Get on default route.')
	res.send("<h1>Hello dorin</h1>");
});

app.post('/savefile', function (req, res) {
	console.log('Recieved - Post via /savefile');
  	res.send('Hello World!');
});