//var request = require("supertest");
var folderpost = require('../tasks/folderpost');
var assert = require("assert");

describe("When posting to a URL", function(){

	var fname = 'C:\\Temp\\files\\Weeklies.zip';
	var dests = ['http://0.0.0.0:3000/savefile'];
	var options = {};

	it("Should return a success", function(done){
		
		var resp = folderpost.post(fname, dests, options);
		assert.equal(resp, 201);
	});
});