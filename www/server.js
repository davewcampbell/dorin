'use strict';

var express = require('express');
var multer = require('multer'); 
var app = express();
var filesRoute = require('./routes/files');
var jobsRoute = require('./routes/jobs');
var router = express.Router();
var path = require("path");


var expressOptions = {
	sizeLimit: function () {
		return 500 * 1000000;
	}
};

// expose the static files in lib
app.use(express.static(path.join(__dirname, 'public')));

// define our views folder and set the engine
app.set('views', path.join( __dirname, '/views') ); // critical to use path.join on windows
app.set('view engine', 'vash');

// middleware to run for every request, just console logging
router.use(function(request, response, next) {

	// log each request to the console
	console.log(request.method, request.url, " - ", new Date());
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


/*******  Routes *******/

// get file by id
router.get('/api/file/:id?', filesRoute.getById);
// save file with attachment
router.post('/api/file', filesRoute.save);

//get list of jobs from mongodb
router.get('/api/jobs', jobsRoute.getAll);
router.get('/api/jobs/:id', jobsRoute.getById);

// Default
router.get("/", function(request, response){
	response.render('index');
});

/*******  Start App *******/
//appy our routes
app.use('/', router);

// Start up the server
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;