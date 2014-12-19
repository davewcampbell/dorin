'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var pathHelper = require('path');
var moment = require("moment");
var logger = require("../logger");
var unirest = require('unirest');
var async = require('async');

function handleError(err, callback){
	logger.error(err);
	return callback(err);
}

/*
* returns true if the array supplied is null or empty, or if the element is contained in the array. 
* Otherwise, false is returned
*/
function isTargetExtension(extensions, ext){
	if(!extensions || extensions.length === 0){
		return true;
	}

	return _.contains(extensions, ext);
}

/*
* Evaluates if the time supplied is after the limit supplied.
*/
function isValidLimit(mtime, limit){
	return (!limit || (limit && moment(mtime).isAfter(limit)));
}


/*
* Main function for the module. Posts the file to the destinations according to the options supplied
*/
function post(parent, destinations, options, callback) {

	// check if which options are set and assign over, otherwise leave them null
	var extensions = options ? options.extensions : null;
	var recursive = options ? options.recursive : null;
	var limit = options ? options.limit : null;

	var post_callback = function (err, paths) {

		if(err){ return handleError(err, callback);}
				// no files, send control to call back
		if(!paths.length){
			return callback(null);	
		}

		var postFile = function (fullname, destinations, cb) {
			async.each(destinations, function(dest, done){

				try{
					unirest.post(dest)
							.stream()
							.attach('file', fullname) // Attachment
							.end(function(response){
								done(null);
							});
				}
				catch(err){
					logger.error(err);
					done(err);
				}		
			}, cb);
		};

		var processPath = function (path, cb) {
			// use the path helper to get our actual path
			var fullpath = pathHelper.resolve(parent, path);

			// find the stats for the path
			fs.stat(fullpath, function (err2, stat) {

				// if err2 has a value, return
				if(err2){return handleError(err2, cb);} 

				// if this is a directory and recursive is truthy, purge it.
				if(stat.isDirectory() && recursive){
					post(fullpath, destinations, options, function (err3) {
						if(err){ return handleError(err3, cb);}
						cb(null);
					});
				}
				// if it is a file and the extension of the file is our target, then delete the file
				// and if there is no limit provided, or the last modified time is before the limit, post the file.
				else if(stat.isFile() && isTargetExtension(extensions, pathHelper.extname(fullpath)) && isValidLimit(stat.mtime, limit)){
					
					logger.log("posting [" + fullpath + "]");						
					postFile(fullpath, destinations, cb);
													
				}
				else{
					cb(null);
				}

			});		
		};

		// iterate the objects in the results
		async.eachLimit(paths, 100, processPath, callback);
	};

	// kick off the process by reading the contents of the path supplied
	fs.readdir(parent, post_callback);
}

/*** Module Exports ***/
module.exports.post = post;
module.exports.setLogPath = function(path){logger.setLogPath(path);};