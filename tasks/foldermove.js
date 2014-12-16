'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");
var logger = require('../logger');
var pathHelper = require('path');
var mkdir = require('mkdirp');

function move(parent, destination, options){	

	var extensions = (options)? options.extensions : null;
	var limit = (options)? options.limit : null;
	var recursive = (options)? options.recursive : null;
	var preserveDirectoryStructure = (options)? options.preserveDirectoryStructure : null;

	var move_callback = function(err, paths){

		_.forEach(paths, function(uri){

			var source = pathHelper.resolve(parent, uri);			

			fs.stat(source, function(err, stats){

				if(err)	return;

				if(stats.isDirectory() && recursive){

					var target = (preserveDirectoryStructure)? pathHelper.resolve(destination,  uri) : destination;
					move(source, target, options);
				}

				if(	stats.isFile() && 
					isValidLimit(stats.mtime, limit) && 
					isTargetExtension(extensions, pathHelper.extname(source))
				){

					if(!fs.existsSync(destination)){
						mkdir.sync(destination);
					}

					var target = pathHelper.resolve(destination,  uri);
					logger.log("Moving [" + source + "] to [" + target + "]");
					fs.renameSync(source, target);
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

module.exports.move = move;
module.exports.setLogPath = function(path){logger.setLogPath(path);};