'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");
var logger = require('../logger');
var pathHelper = require('path');
var mkdir = require('mkdirp');
var async = require('async');

function move(parent, destination, options, callback){	

	// set our values from the options, accounting for nulls
	var extensions = (options)? options.extensions : null;
	var limit = (options)? options.limit : null;
	var recursive = (options)? options.recursive : null;
	var preserveDirectoryStructure = (options)? options.preserveDirectoryStructure : null;

	var move_callback = function(err, paths){

		// create the function that will handle a path
		var processPath = function(uri, cb){

			// the path is the parent plus the uri supplied
			var source = pathHelper.resolve(parent, uri);			

			// inspect the stats of this path
			fs.stat(source, function(err, stats){

				// Make a call to the call back if an error is found
				if(err)	cb(err);

				// if this is a directory and we are to recursively process, make a call to this directory using the move function
				if(stats.isDirectory() && recursive){

					// if we are to preserve the directory structure, update the target path, otherwise use the same destination as before
					var target = (preserveDirectoryStructure)? pathHelper.resolve(destination,  uri) : destination;
					// call move again with this itreration's source. Receive the call back and immediate call back again
					move(source, target, options, cb);
				}
				// if this is a file, within range and of the target extension, we will want to move the file
				else if(	stats.isFile() && 
					isValidLimit(stats.mtime, limit) && 
					isTargetExtension(extensions, pathHelper.extname(source))
				){

					// if the folder we want to move it to doesn't exists, create it
					if(!fs.existsSync(destination)){
						mkdir.sync(destination);
					}

					// create the target for our file to move to
					var target = pathHelper.resolve(destination,  uri);
					logger.log("Moving [" + source + "] to [" + target + "]");
					// move the file
					fs.move(source, target, cb);
				}
				// if it is none of these, callback
				else{
					cb(null);
				}

			});		
						
		};

		// iterate over the list of paths, limiting the number of in process tasks.
		async.eachLimit(paths, 100,  processPath, callback);
	};

	// start the process by reading all paths in the root supplied.
	fs.readdir(parent, move_callback);
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

function isValidLimit(mtime, limit){
	return (!limit || (limit && moment(mtime).isAfter(limit)));
}

module.exports.move = move;
module.exports.setLogPath = function(path){logger.setLogPath(path);};