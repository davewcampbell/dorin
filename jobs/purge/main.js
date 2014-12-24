'use strict';
var moment = require("moment");
var _ = require('lodash');
var async = require('async');
var logger = require('../../logger')();
var task = require('../../tasks/prairiedog');


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
		var activity = task();
		activity.setLogPath(__dirname, job.id);

		// run the purge activity
		activity.purge(job.source,
			job.options,
			function(err){
				handleCallback(err, job.name);
			});

	});
}


