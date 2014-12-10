'use strict';
var moment = require("moment");

//var channel = require('./controllers/channel.js');

//var path = "\\\\TOR-FILE-FTP\\root_distribution\\DOR-DIM\\Assets\\Staging\\AP\\photo\\2014\\12\\04\\";
//var path = "\\\\TOR-FILE-FTP\\root_distribution\\DOR-DIM\\Assets\\Staging\\AP\\text\\2014\\12\\04\\";
//var path = "C:\\Temp\\files\\archive\\";

//var destinations = ["C:\\Temp\\TestCopy\\"];

//channel.run(path, destinations);
//channel.test("C:\\Temp\\regedit value.txt");


var path = '\\\\192.168.203.201\\Jimi\\Input\\';

var activity = require('./controllers/folderactivity');

activity.purge(path, null, true, moment().subtract(1, 'days'), function(err){
	if(err)
		console.log(err);
	else
		console.log("all done");
});
