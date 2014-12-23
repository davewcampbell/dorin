'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var pathHelper = require('path');
var moment = require("moment");
var logger = require("../logger");
var unirest = require('unirest');
var async = require('async');
var mkdir = require('mkdirp');

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

function moveItem(source, destinations, next){
	async.each(destinations, function(dest, done){
		if(!fs.existsSync(dest)){
			mkdir.sync(dest);
		}
						
		var target = pathHelper.join(dest, pathHelper.basename(source));
		fs.move(source, target, done);
	}, next);
}

function copyItem(source, destinations, next){

	async.each(destinations, function(dest, done){
		if(!fs.existsSync(dest)){
			mkdir.sync(dest);
		}
						
		var target = pathHelper.join(dest, pathHelper.basename(source));
		fs.copy(source, target, done);
	}, next);
}

function purgeItem(source, destinations, next){

		fs.unlink(source, next);
}

function postItem(source, destinations, next){					
	async.each(destinations, function(dest, done){
		try{
			unirest.post(dest)
					.stream()
					.attach('file', source) // Attachment
					.end(function(response){
						done(null);
					});
		}
		catch(err){
			logger.error(err);
			done(err);
		}		
	}, next);
}

function isAfter(compare, benchmark){
	return benchmark && moment(compare).isAfter(benchmark);
}
function isBefore(compare, benchmark){
	return benchmark && moment(compare).isBefore(benchmark);
}
/*
* Main function for the module. Posts the file to the destinations according to the options supplied
*/
function crawl(parent, destinations, options, action, callback) {

	// check if which options are set and assign over, otherwise leave them null
	var extensions = options ? options.extensions : null;
	var recursive = options ? options.recursive : null;
	var limit = options ? options.limit : null;
	var preserveDirectoryStructure = options ? options.preserveDirectoryStructure : null;
	
	var comparison = isBefore;
	switch(options.compareAs){
		case "before":
		comparison = isBefore;
		break;

		default:
		comparison = isAfter;
		break;
	}

	var processPaths = function (err, paths) {

		if(err){ return handleError(err, callback);}
				
		// no files, send control to call back
		if(!paths.length){
			return callback(null);	
		}

		var processPath = function (path, cb) {
			// use the path helper to get our actual path
			var fullpath = pathHelper.resolve(parent, path);

			// find the stats for the path
			fs.stat(fullpath, function (err2, stat) {

				// if err2 has a value, return
				if(err2){return handleError(err2, cb);} 

				// if this is a directory and recursive is truthy, purge it.
				if(stat.isDirectory() && recursive){

					// if we are to preserve the diretory structure, we need to update the list of destinations before sending
					// into the recursive call.  Otherwise, just send the root destination array we got originally.
					var recusriveDestinations =  preserveDirectoryStructure ? _.map(destinations, function(dest){ 
							return pathHelper.resolve(dest, path);
						}) : destinations;

					crawl(fullpath, recusriveDestinations, options, action, function (err3) {
						if(err){ return handleError(err3, cb);}
						cb(null);
					});
				}
				// if it is a file and the extension of the file is our target, then delete the file
				// and if there is no limit provided, or the last modified time is before the limit, post the file.
				else if(stat.isFile() && isTargetExtension(extensions, pathHelper.extname(fullpath)) && comparison(stat.mtime, limit)){
					
					logger.log("processing [" + fullpath + "]");						
					action(fullpath, destinations, cb);
				}
				else{
					logger.warn("ignoring [" + fullpath + "]");
					cb(null);
				}

			});		
		};

		// iterate the objects in the results
		async.eachLimit(paths, 100, processPath, callback);
	};

	// kick off the process by reading the contents of the path supplied
	fs.readdir(parent, processPaths);
}

function post(parent, destinations, options, callback){
	var action = postItem;
	crawl(parent, destinations, options, action, callback);
}

function copy(parent, destinations, options, callback){
	var action = copyItem;
	crawl(parent, destinations, options, action, callback);
}

function move(parent, destination, options, callback){
	var action = moveItem;
	crawl(parent, [destination], options, action, callback);
}

function purge(parent, options, callback){
	var action = purgeItem;
	logger.log(parent);
	crawl(parent, null, options, action, callback);
}

/*** Module Exports ***/
module.exports.post = post;
module.exports.copy = copy;
module.exports.move = move;
module.exports.purge = purge;
module.exports.setLogPath = logger.setLogPath;