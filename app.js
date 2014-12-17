'use strict';


var express = require('express');
var app = express();
var filesRoute = require('./routes/files');

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

// Default
app.get("/", function(req, res){
	console.log('Received - Get on default route.')
	res.status(200).send("<h1>Hello dorin</h1>");
});

// get file by id
app.get('/file/:id?', filesRoute.getById);
app.post('/file', filesRoute.save);

module.exports = app;