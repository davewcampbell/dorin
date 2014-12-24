'use strict';

/*
* Main exported function.  Holds the logic and functions for the module
*/
function main(){
	var fs = require("fs-extra");
	var _ = require("lodash");
	var pathHelper = require('path');
	var moment = require("moment");
	var logger = require("../logger")();
	var unirest = require('unirest');
	var async = require('async');
	var mkdir = require('mkdirp');

	/*
	* Handles error call backs. Logs the error and returns it to the callback supplied
	*/
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
	* Action method to move the source variable to all the destination variables.
	* Returns control to the call back function in next.
	*/
	function moveItem(source, destinations, next){
		async.each(destinations, function(dest, done){
			if(!fs.existsSync(dest)){
				mkdir.sync(dest);
			}
							
			var target = pathHelper.join(dest, pathHelper.basename(source));

			logger.log("moving [" + source + "] to [" + target + "]");	
			fs.move(source, target, done);
		}, next);
	}

	/*
	* Acton function to copy the source file to all the destination variables locations.
	* Returns control to the callback function in next.
	*/
	function copyItem(source, destinations, next){

		async.each(destinations, function(dest, done){
			if(!fs.existsSync(dest)){
				mkdir.sync(dest);
			}
							
			var target = pathHelper.join(dest, pathHelper.basename(source));

			logger.log("copying [" + source + "] to [" + target + "]");	
			fs.copy(source, target, done);
		}, next);
	}

	/*
	* Action function to delete the source supplied. Destination is not used but supplied
	* to keep the signature the same.  Control is returned to next.
	*/
	function purgeItem(source, destinations, next){

			logger.log("purging [" + source + "]");	
			fs.unlink(source, next);
	}

	/*
	* Action function to post the source to the destinations supplied. 
	* Control is returned to next.
	*/
	function postItem(source, destinations, next){					
		async.each(destinations, function(dest, done){
			try{

				logger.log("posting [" + source + "] to [" + dest + "]");	
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

	/*
	* Compares the compare value with its benchmark to see if it is after the benchmark.
	*/
	function isAfter(compare, benchmark){
		return benchmark && moment(compare).isAfter(benchmark);
	}

	/*
	* Compares the compare value with the benchmark to see if the compare is before the benchmark.
	*/
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
		var logIgnored = options ? options.logIgnored : null;
		
		var comparison = limit && limit.compareAs && limit.compareAs === "before" ? isBefore : isAfter;

		var cutoffDate = limit && limit.interval && limit.value ? moment().subtract(limit.value, limit.interval) : moment();

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
					else if(stat.isFile() && isTargetExtension(extensions, pathHelper.extname(fullpath)) && comparison(stat.mtime, cutoffDate)){											
						action(fullpath, destinations, cb);
					}
					else{
						if(logIgnored){
							logger.warn("ignoring [" + fullpath + "]");
						}
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

	/*
	* Publicly exposed method to post files to the destinations according to the options supplied.  
	* Control is returned to callback after all files are posted.
	*/
	function post(parent, destinations, options, callback){
		var action = postItem;
		crawl(parent, destinations, options, action, callback);
	}

	/*
	* Publicly exposed method to copy files to the destinations according to the options supplied.  
	* Control is returned to callback after all files are copied.
	*/
	function copy(parent, destinations, options, callback){
		var action = copyItem;
		crawl(parent, destinations, options, action, callback);
	}

	/*
	* Publicly exposed method to move files to the destinations according to the options supplied.  
	* Control is returned to callback after all files are moved.
	*/
	function move(parent, destination, options, callback){
		var action = moveItem;
		crawl(parent, [destination], options, action, callback);
	}

	/*
	* Publicly exposed method to purge files to the destinations according to the options supplied.  
	* Control is returned to callback after all files are purged.
	*/
	function purge(parent, options, callback){
		var action = purgeItem;
		logger.log(parent);
		crawl(parent, null, options, action, callback);
	}

	/*
	* Revealing module pattern. Return an annonomous function with the methods we want exposed.
	*/
	return{
		post: post,
		copy: copy,
		move: move,
		purge: purge,
		setLogPath: logger.setLogPath
	};
}



/*** Module Exports ***/
module.exports = main;