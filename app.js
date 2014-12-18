'use strict';


var express = require('express');
var multer = require('multer'); 
var app = express();
var filesRoute = require('./routes/files');
var router = express.Router();

// middleware to run for every request, just console logging
router.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);
	// continue doing what we were doing and go to the route
	next();	
});

// define the uploads directory
app.use('/file', multer({ 
	dest: './uploads/',
	rename: function (fieldname, filename) {
    	return filename.replace(/\W+/g, '-').toLowerCase() + "-" + Date.now();
	},
	limits:{
		fileSize: 100000000 
	}
}));


// get file by id
router.get('/file/:id?', filesRoute.getById);
// save file with attachment
router.post('/file', filesRoute.save);


// Default
router.get("/", function(req, res){
	res.status(200).send("<h1>Hello dorin</h1>");
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