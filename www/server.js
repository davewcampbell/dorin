'use strict';

var express = require('express');
var app = express();
var routeConfig = require('./config/routes');
var path = require("path");
var middlewareConfig = require('./config/middleware');

var router = express.Router();

// define our views folder and set the engine
app.set('views', path.join( __dirname, '/views') ); // critical to use path.join on windows
app.set('view engine', 'vash');


routeConfig(router);
middlewareConfig(app, express, router, __dirname);

/*******  Start App *******/
// Start up the server
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;