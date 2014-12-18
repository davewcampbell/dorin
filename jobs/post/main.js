'use strict';

var task = require('../../tasks/folderpost');
var logger = require('../../logger');
var moment = require('moment');
var _ = require('lodash');

var jobs = require('./data');

_.forEach(jobs, function (job) {

	logger.log(job.name);

	var options = {
		extensions: job.extensions,
		recursive: job.recursive,
		limit: moment().subtract(job.limit.value, job.limit.key)
	};


	task.post(job.source, job.destinations, options, function (err) {handleCallback(err, job.name)})
});


/*
* Helper function for call backs from the jobs
*/
function handleCallback(err, name) {
	if(err)
		logger.error("Error for: " + name + " -- " + err);
	else
		logger.info(name + " has completed successfully");
}