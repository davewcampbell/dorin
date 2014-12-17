'use strict';
var moment = require("moment");
var _ = require('lodash');
var activity = require('../../tasks/foldercopy');
var winston = require('winston');

//********* Main **********//
// Data store, our models
var jobs = require('./data');


// ensure there are jobs found
if(jobs && jobs.length){

	_.forEach(jobs, function(job){
		activity.setLogPath(job.source);
		log(job.name);

		// use the current job to set the options for this activity
		var options = {
			extensions: job.extensions,
			recursive: job.recursive,
			preserveDirectoryStructure: job.preserveDirectoryStructure,
			limit: moment().subtract(job.limit.value, job.limit.key)
		};

		// run the move activity
		activity.copy(job.source,
			job.destinations,
			options,
			function(err){
				handleCallback(err, job.name);
			});
	});
}

function log(message){
	winston.log(message);
	winston.info(message);
}


/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name){

	if(err)
		log("Error for: " + name + " -- " + err);
	else
		log(name + " has completed successfully");
}

