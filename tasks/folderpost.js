'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var pathHelper = require('path');
var moment = require("moment");
var logger = require("../logger");
var unirest = require('unirest');

/*
* Main function for the module. Posts the file to the destinations according to the options supplied
*/
function post(filename, destinations, options){

	_.forEach(destinations, function(dest){

		try{
			logger.log("posting to " + dest);
			unirest.post(dest)
					.headers({ 'Accept': 'application/json' })
					.attach('file', filename) // Attachment
					.end(function (response) {
					  logger.log(response.body);		  
					});
		}
		catch(err){
			logger.error(err);
		}		
	});

	return 201;
}

module.exports.post = post;
module.exports.setLogPath = function(path){logger.setLogPath(path);};