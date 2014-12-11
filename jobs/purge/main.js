'use strict';
var moment = require("moment");
var _ = require('lodash');
var activity = require('../../tasks/folderpurge');
var winston = require('winston');

//********* Main **********//
// Data store, should be moved to a database or service file
var jobs = require('./data');

// we may not want to run all jobs every time.  Define the ones we want here
var targetIds = ['01a86231-b1c6-417e-8658-e1999465a6ad'];

// create a new variable that will hold the targed Jobs by Id, or if none supplied, all the jobs in the data file
var scheduledJobs = (targetIds && targetIds.length) ? _.transform(jobs, function(result, job){
	if(_.contains(targetIds, job.id)){
		result.push(job);
	}

	return result;
}) : jobs;

// log how many jobs we are about to run
winston.info("Jobs to run: " + scheduledJobs.length);

// ensure there are jobs found
if(scheduledJobs && scheduledJobs.length){

	_.forEach(scheduledJobs, function(job){
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