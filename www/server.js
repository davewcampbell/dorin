'use strict';

var express = require('express');
var multer = require('multer'); 
var app = express();
var filesRoute = require('./routes/files');
var router = express.Router();


var expressOptions = {
	sizeLimit: function () {
		return 500 * 1000000;
	}
};

// middleware to run for every request, just console logging
router.use(function(request, response, next) {

	// log each request to the console
	console.log(request.method, request.url);
	// continue doing what we were doing and go to the route
	next();	
});

// define the uploads directory
app.use('/api/file', multer({ 
	dest: './uploads/',
	rename: function (fieldname, filename) {
    	return filename.replace(/\W+/g, '-').toLowerCase() + "-" + Date.now();
	},
	limits:{
		fileSize: expressOptions.sizeLimit()
	}
}));


// get file by id
router.get('/api/file/:id?', filesRoute.getById);
// save file with attachment
router.post('/api/file', filesRoute.save);


// Default
router.get("/", function(request, response){
	response.status(200).send("<h1>Hello dorin</h1>");
});

//appy our routes
app.use('/', router);

// Start up the server
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = app;