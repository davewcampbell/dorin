'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");

function copy(path, destinations){	

	var copy_callback = function(err, files){
		_.forEach(files, function(file){

			var source = path + file;

			_.forEach(destinations, function(destination){
				var target = destination + file;

				fs.stat(source, function(err, stats){
					var lmtime = moment(stats.mtime);
					
					console.log(lmtime.format("l"));

					if(!err){
						fs.copySync(source, target);
					}

				});		
			});			
		});
	};

	fs.readdir(path, copy_callback);
}

module.exports.copy = copy;