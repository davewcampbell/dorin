'use strict';


function main(){
	var winston = require('winston');
	var pathHelper = require('path');
	var fs = require('fs');
	var mkdir = require('mkdirp');
	var moment = require('moment');

	function createLogger(){
		var logger = new (winston.Logger)({transports: [new (winston.transports.Console)()]});
		return logger;	
	}


	var logger = createLogger();

	/*
	* Logs the messaeg to the console
	*/
	function log(message){
		logger.info(message);
		logger.log(message);
	}

	/*
	* Adds a new logger for file using the path as the root to create the custom .dorin folder where the logs reside
	*/
	function setLogPath(path, fname){

		var filename = fname || '';
		// create the .dorin folder to hold our data in its hidden folder
		var logpath = pathHelper.join(path, "logs", filename);
		// if the folder sturctre doesn't exist, create it
		if(!fs.existsSync(logpath)){
			mkdir.sync(logpath);
		}

		logpath = pathHelper.join(logpath, moment().format('YYYY-MM-DD') + ".log");
		logger.info(logpath);

		// add a new file logger to put the file in the .dorin folder using our filename date convention
		logger.add(require('winston').transports.File, { filename: logpath });
	}

	return {
		log: log,
		error: logger.error,
		warn: logger.warn,
		info: logger.info,
		setLogPath: setLogPath
	};
}


module.exports = main;