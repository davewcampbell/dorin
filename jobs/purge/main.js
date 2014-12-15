'use strict';
var moment = require("moment");
var _ = require('lodash');

var winston = require('winston');
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });

//********* Main **********//
// Data store, should be moved to a database or service file
var jobs = require('./data');

// we may not want to run all jobs every time.  Define the ones we want here
var targetIds = ['4602db39-755f-4041-ab7d-37db6714e9eb'];

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
		winston.info(job.name);

		// define a new options variable for our purge activity
		var options = {
			extensions: job.extensions,
			recursive: job.recursive,
			limit: moment().subtract(job.limit.value, job.limit.key)
		};

		// create a new purge activity
		var activity = require('../../tasks/folderpurge');
		activity.setLogPath(job.path);
		// run the purge activity
		activity.purge(job.path, options, function(err){handleCallback(err, job.name)});
	});
}



/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name){
	if(err)
		logger.error("Error for: " + name + " -- " + err);
	else
		logger.info(name + " has completed successfully");
}