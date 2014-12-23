'use strict';

var activity = require('../../tasks/foldercrawler');
var logger = require('../../logger');
var moment = require('moment');
var _ = require('lodash');

var jobs = require('./data');

var start = new Date();
/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name) {
	if(err){
		logger.error("Error for: " + name + " -- " + err);
	}

	else{
		logger.info(name + " has completed successfully");		
	}

	var duration = (new Date() - start) * 0.001;

	logger.log("Total Time: " + duration + " seconds");

}


_.forEach(jobs, function (job) {
	activity.setLogPath(__dirname, job.id);
	logger.log(job.name);

	var options = {
		extensions: job.extensions,
		recursive: job.recursive,
		limit: moment().subtract(job.limit.value, job.limit.key)
	};


	activity.post(job.source, job.destinations, options, function (err) {
		handleCallback(err, job.name);
	});
});


