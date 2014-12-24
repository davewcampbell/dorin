'use strict';
var moment = require("moment");
var _ = require('lodash');
var task = require('../../tasks/prairiedog');
var winston = require('winston');

//********* Main **********//
// Data store, our models
var jobs = require('./data');




function log(message){
	winston.log(message);
	winston.info(message);
}

/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name){

	if(err){
		log("Error for: " + name + " -- " + err);
	}
	else{
		log(name + " has completed successfully");
	}
}

// ensure there are jobs found
if(jobs && jobs.length){

	_.forEach(jobs, function(job){
		var activity = task();
		activity.setLogPath(__dirname, job.id);

		// use the current job to set the options for this activity
		var options = {
			extensions: job.extensions,
			recursive: job.recursive,
			preserveDirectoryStructure: job.preserveDirectoryStructure,
			limit: moment().subtract(job.limit.value, job.limit.key),
			compareAs: job.limit.compareAs,
			logIgnored: job.logIgnored
		};

		// run the move activity
		activity.move(job.source,
			job.destination,
			options,
			function(err){
				handleCallback(err, job.name);
			});

		log(job.name);
	});
}