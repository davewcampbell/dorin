'use strict';

var fs = require("fs-extra");
var _ = require("lodash");
var moment = require("moment");

function run(path, destinations){	

	var run_callback = function(err, files){
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


	fs.readdir(path, run_callback);
}


function test(file){
	fs.stat(file, function(err, stats){
		var dt = moment(stats.mtime);
		console.log(dt.format("YYYYMMDD"));
	});

}

module.exports.test = test;
module.exports.run = run;