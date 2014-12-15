'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var pathHelper = require('path');
var moment = require("moment");
var logger = require("../logger");


/*
* ****** EXPORTED FUNCTION
* Peforms the purge on the parent folder according to the options supplied
*/
function purge(parent, options, callback){	

	// check if which options are set and assign over, otherwise leave them null
	var extensions = (options) ? options.extensions : null;
	var recursive = (options) ? options.recursive : null;
	var limit = (options) ? options.limit : null;


	// Callback function for the read directory method
	var purge_callback = function(err, paths){

		// error, send result back immediately
		if(err)  return handleError(err, callback);
		// no files, send control to call back
		if(!paths.length) return callback(null);

		// iterate the objects in the results
		_.forEach(paths, function(path){

			// use the path helper to get our actual path
			var fullpath = pathHelper.resolve(parent, path);

			// find the stats for the path
			fs.stat(fullpath, function(err2, stat){

				// if err2 has a value, return
				if(err2) return handleError(err2, callback);

				// if this is a directory and recursive is truthy, purge it.
				if(stat.isDirectory() && recursive){
					purge(fullpath, options, function(err3){
						if(err) return handleError(err3, callback);
					});
				}
				// if it is a file and the extension of the file is our target, then delete the file
				else if(stat.isFile() && isTargetExtension(extensions, pathHelper.extname(fullpath))){

					// if there is no limit provided, or the last modified time is before the limit, delete the file.
					if(!limit || (limit && moment(stat.mtime).isBefore(limit))){
						deleteFile(fullpath);
						logger.log(fullpath);
					}					
				}
			});					
		});
	};


	// kick off the process by reading the contents of the path supplied
	fs.readdir(parent, purge_callback);
}

function handleError(err, callback){
	logger.error(err);
	return callback(err);
}

/*
*	Deletes the path syncroniously
*/
function deleteFile(path){
	fs.unlinkSync(path);
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


// Export the purge method
module.exports.purge = purge;
module.exports.setLogPath = function(path){ logger.setLogPath(path);};