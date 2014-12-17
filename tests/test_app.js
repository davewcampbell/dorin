var request = require("supertest");
var assert = require("assert");

var app = require("../app");


describe("Testing files routes", function(){


	it("should return 200", function(done){
		request(app)
			.get("/")
			.expect(200, done)
	});

	it("Should return not found", function(done){
		request(app)
			.get("/file/1")
			.expect(/found/i)
			.end(done);
	});
});

describe("Test posting a file to a URL", function(){

	var fname = 'C:\\Temp\\files\\Weeklies.zip';

	it("Should return a success", function(done){
		
		var resp = folderpost.post(fname, dests, options);
		assert.equal(resp, 201);
	});
});