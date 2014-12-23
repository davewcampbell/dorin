'use strict';
var moment = require("moment");
var _ = require('lodash');
var async = require('async');
var logger = require('../../logger');
var activity = require('../../tasks/foldercrawler');


function log(message){
	logger.log(message);
}

/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name){
	if(err){
		logger.error("Error for: " + name + " -- " + err);
	}		
	else{
		log(name + " has completed successfully");	
	}
}


//********* Main **********//
// Data store, should be moved to a database or service file
var jobs = require('./data');

// ensure there are jobs found
if(jobs && jobs.length){

	_.forEach(jobs, function(job){
		activity.setLogPath(__dirname, job.id);
		log(job.name);

		// use the current job to set the options for this activity
		var options = {
			extensions: job.extensions,
			recursive: job.recursive,
			limit: moment().subtract(job.limit.value, job.limit.key),
			compareAs: job.limit.compareAs
		};

		// run the move activity
		activity.purge(job.source,
			options,
			function(err){
				handleCallback(err, job.name);
			});
	});
}


