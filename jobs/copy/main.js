'use strict';
var moment = require("moment");
var _ = require('lodash');
var async = require('async');
var logger = require('../../logger')();
var task = require('../../tasks/prairiedog');
var http = require('http');


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

function runJobs(jobs){

	// ensure there are jobs found
	if(jobs && jobs.length){

		_.forEach(jobs, function(job){

			var activity = task();
			activity.setLogPath(__dirname, job.id);

			// run the purge activity
			activity.copy(job.source,
				job.destinations,
				job.options,
				function(err){
					handleCallback(err, job.name);
				});
		});
	}
	else{
		log("No copy jobs found. Exiting.");
	}
}


//********* Main **********//
// Call our api to get the data
var url = 'http://localhost:3000/api/jobs/type/copy';

http.get(url, function(res) {
	var body = '';

	res.on('data', function(chunk) {
		body += chunk;
	});

	res.on('end', function() {
		var jobs = JSON.parse(body);
		runJobs(jobs);
	});
}).on('error', function(e) {
	log("Error received from HTTP Get of jobs: " + e);
});
