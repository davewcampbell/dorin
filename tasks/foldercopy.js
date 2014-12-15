'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");
var winston = require("winston");
var logger = require('../logger');
var pathHelper = require('path');

function copy(parent, destination, options){	

	var extensions = (options)? options.extensions : null;
	var limit = (options)? options.limit : null;
	var recursive = (options)? options.recursive : null;
	var preserveDirectoryStructure = (options)? options.preserveDirectoryStructure : null;

	var copy_callback = function(err, paths){

		_.forEach(paths, function(uri){

			var source = pathHelper.resolve(parent, uri);			

			fs.stat(source, function(err, stats){

				if(err)	return;

				if(stats.isDirectory() && recursive){

					var target = (preserveDirectoryStructure)? pathHelper.resolve(destination,  uri) : destination;

					if(!fs.existsSync(destination)){												
						fs.mkdirSync(destination);
					}

					copy(source, target, options);
				}

				if(	stats.isFile() && 
					isValidLimit(stats.mtime, limit) && 
					isTargetExtension(extensions, pathHelper.extname(source))
				){

					if(!fs.existsSync(destination)){
						fs.mkdirSync(destination);
					}


					var target = pathHelper.resolve(destination,  uri);
					logger.log("Moving [" + source + "] to [" + target + "]");
					fs.copySync(source, target);
				}
			});		
						
		});
	};

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

function log(message){
	winston.log(message);
	winston.info(message);
}

module.exports.move = move;
module.exports.setLogPath = function(path){logger.setLogPath(path);};