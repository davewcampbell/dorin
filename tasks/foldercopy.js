'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");
var logger = require('../logger');
var pathHelper = require('path');
var mkdir = require('mkdirp');
var async = require('async');

/*
* Main function of the module.  Copies all files that match the options in the parent path
* to each destination in the destinations array. 
*/
function copy(parent, destinations, options, callback){	

	// fill in the options accounting for null values
	var extensions = (options)? options.extensions : null;
	var limit = (options)? options.limit : null;
	var recursive = (options)? options.recursive : null;
	var preserveDirectoryStructure = (options)? options.preserveDirectoryStructure : null;

	// the call back for all paths in a directory
	var copy_callback = function(err, paths){

		// inline function to handle each path in a directory
		var processPath = function(uri, cb){

			// get the full path by concating the parent with the uri supplied
			var source = pathHelper.resolve(parent, uri);			

			// check the stats of the path and handle differently if it is a file or a directory
			fs.stat(source, function(err, stats){

				// any errors are sent to the callback of processPath
				if(err)	cb(err);

				// if this is a directory and we are to process recursively, send this uri to copy again
				if(stats.isDirectory() && recursive){

					// if we are to preserve the diretory structure, we need to update the list of destinations before sending
					// into the recursive call.  Otherwise, just send the root destination array we got originally.
					var recusriveDestinations = (preserveDirectoryStructure)? 
						_.map(destinations, function(dest){ 
							return pathHelper.resolve(dest, uri);
						}) : destinations;

					// call copy with our recursive destination values, the original options and this call back
					copy(source, recusriveDestinations, options, cb);
				}
				// if this is a file within the time range and has a targeted extension, copy it
				else if(stats.isFile() && 
						isValidLimit(stats.mtime, limit) && 
						isTargetExtension(extensions, pathHelper.extname(source))){

					// in line function to handle the copy of source to a particular destination
					var copyFile = function(destination, done){

						// try catch in case of errors
						try{
							if(!fs.existsSync(destination)){
								mkdir.sync(destination);
							}

							// add the parent destination with this uri
							var target = pathHelper.resolve(destination,  uri);
							logger.log("Copying [" + source + "] to [" + target + "]");

							// copy the file from source to target passing in the done call back.
							fs.copy(source, target, done);
						}
						catch(ex){
							// log the error and call the done method with the exception
							logger.error(ex);
							done(ex);
						}
					};

					// loop through all the destinations and pass in each value to copy file.
					async.eachLimit(destinations, 6, copyFile, cb);					
				}
				// if this is anything else, call the call back with no error to close it off
				else{
					logger.warn("Ignoring [" + source + "]");
					cb(null);
				}
			});		
						
		};

		// loop through all paths, lmiting the number of in process tasks
		// use ProcessPath to handle the action on the path, call the callback when done
		async.eachLimit(paths, 100, processPath, callback);
	};

	// get all paths for this parent path sending the result to the call back.
	fs.readdir(parent, copy_callback);
}

/*
* returns true if the array supplied is null or empty, or if the element is contained in the array. 
* Otherwise, false is returned
*/
function isTargetExtension(extensions, ext){
	if(extensions == null || extensions.length == 0)
		return true;

	return _.contains(extensions, ext);
}

/*
* Evaluates if the time supplied is after the limit supplied.
*/
function isValidLimit(mtime, limit){
	return (!limit || (limit && moment(mtime).isAfter(limit)));
}

/** Module Exports **/
module.exports.copy = copy;
module.exports.setLogPath = function(path){logger.setLogPath(path);};