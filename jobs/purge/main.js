'use strict';
var moment = require("moment");
var _ = require('lodash');
var activity = require('../../controllers/folderactivity');
var winston = require('winston');

//********* Main **********//
// Data store, should be moved to a database or service file
var jobs = require('./data');

// ensure there are jobs found
if(jobs && jobs.length){

	_.forEach(jobs, function(job){
		winston.log(job.name);

		// run the purge activity
		activity.purge(job.path, 
			job.extensions, 
			job.recursive, 
			moment().subtract(job.limit.value, job.limit.key), 
			function(err){handleCallback(err, job.name)});
	});
}



/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name){
	if(err)
		winston.log("Error for: " + name + " -- " + err);
	else
		winston.log(name + " has completed successfully");
}