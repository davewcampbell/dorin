'use strict';
var moment = require("moment");
var _ = require('lodash');
var activity = require('../../tasks/foldermove');
var winston = require('winston');

//********* Main **********//
// Data store, our models
var jobs = require('./data');


// ensure there are jobs found
if(jobs && jobs.length){

	_.forEach(jobs, function(job){
		log(job.name);

		// run the move activity
		activity.move(job.source,
			job.extensions, 
			job.destination,
			moment().subtract(job.limit.value, job.limit.key));
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


function log(message){
	winston.log(message);
	winston.info(message);
}

