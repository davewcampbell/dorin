'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var pathHelper = require('path');
var moment = require("moment");
var winston = require('winston');
winston.add(winston.transports.File, { filename: ".\\log_" + moment().format('YYYY-MM-DD') + '.log' });

function purge(parent, extensions, recursive, limit, callback){	

	winston.log('Purging ' + parent);

	// Callback function for the read directory method
	var this_callback = function(err, paths){

		// error, send result back immediately
		if(err) return callback(err);

		// no files, send control to call back
		if(!paths.length) return callback(err);

		// iterate the objects in the results
		_.forEach(paths, function(path){

			// use the path helper to get our actual path
			var fullpath = pathHelper.resolve(parent, path);

			// find the stats for the path
			fs.stat(fullpath, function(err2, stat){

				// if err2 has a value, return
				if(err2) return;

				// if this is a directory and recursive is truthy, purge it.
				if(stat.isDirectory() && recursive){
					purge(fullpath, extensions, recursive, limit, function(err){});
				}
				// if it is a file and the extension of the file is our target, then delete the file
				else if(stat.isFile() && isTargetExtension(extensions, pathHelper.extname(fullpath))){

					// if there is no limit provided, or the last modified time is before the limit, delete.
					if(!limit || (limit && moment(stat.mtime).isBefore(limit))){
						deleteFile(fullpath);
						log(fullpath);
					}
					
				}
			});
					
		});

		return callback(null);
	};


	// kick off the process by reading the contents of the path supplied
	fs.readdir(parent, this_callback);
}

/*
*	Deletes the path syncroniously
*/
function deleteFile(path){
	fs.unlinkSync(path);
	//log(path);
}

/*
* Logs the messaeg to the console
*/
function log(message){
	winston.info(message);
}


/*
* returns true if the array supplied is null or empty, or if the element is contained in the array. 
* Otherwise, false is returned
*/
function isTargetExtension(array, element){
	if(array == null || array.length == 0)
		return true;

	return _.contains(array, element);
}

// Export the purge method
module.exports.purge = purge;