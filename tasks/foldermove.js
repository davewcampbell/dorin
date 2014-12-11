'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");
var winston = require("winston");
var pathHelper = require('path');

function move(path, extensions, destination, limit){	

	log("Received " + path);

	var move_callback = function(err, files){

		_.forEach(files, function(file){

			var source = path + file;			
			var target = destination + file;

			fs.stat(source, function(err, stats){

				if(err)	return;

				if(	stats.isFile() && 
					isValidLimit(stats.mtime, limit) && 
					isTargetExtension(extensions, pathHelper.extname(source))
				){

					if(!fs.existsSync(destination)){
						fs.mkdirSync(destination);
					}

					log("Moving to " + target);
					fs.renameSync(source, target);
				}
			});		
						
		});
	};

	fs.readdir(path, move_callback);
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