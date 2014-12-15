var winston = require('winston');
var pathHelper = require('path');
var fs = require('fs');
var mkdir = require('mkdirp');
var logger = createLogger();
var moment = require('moment');

function createLogger(){

	var logger = new (winston.Logger)({transports: [new (winston.transports.Console)()]});

	return logger;	
}

/*
* Logs the messaeg to the console
*/
function log(message){
	logger.info(message);
	logger.log(message);
}

function error(message){
	logger.error(message);
}

function warn(message){
	logger.warn(message);
}

/*
* Adds a new logger for file using the path as the root to create the custom .dorin folder where the logs reside
*/
function setLogPath(path){

	// create the .dorin folder to hold our data in its hidden folder
	var logpath = pathHelper.resolve(path, ".dorin/log/");
	// if the folder sturctre doesn't exist, create it
	if(!fs.existsSync(logpath)){
		mkdir.sync(logpath);
	}

	var logpath = pathHelper.resolve(logpath,  moment().format('YYYY-MM-DD') + ".log");

	// add a new file logger to put the file in the .dorin folder using our filename date convention
	logger.add(require('winston').transports.File, { filename: logpath });
}

module.exports.log = log;
module.exports.error = error;
module.exports.warn = warn;
module.exports.setLogPath = setLogPath;