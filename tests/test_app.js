var request = require("supertest");
var assert = require("assert");

var app = require("../www/server");


describe("Files routes", function(){


	it("get root should return 200", function(done){
		request(app)
			.get("/")
			.expect(200, done)
	});

});

// describe("post a file to a URL", function(){

// 	var fname = 'C:\\Temp\\files\\Weeklies.zip';
// 	var dests = ["http://localhost:3000/file"];
// 	var folderpost = require("../tasks/folderpost");

// 	it("should return a success", function(done){
		
// 		var resp = folderpost.post(fname, dests, {}, function(err){
// 			console.log(err);
// 			done();
// 		});
		
// 	});
// });

describe("Validate limit logic", function(done){

	var before = "isBefore";
	var after = "isAfter";
	function getLimit(limit){
		return limit && limit.compareAs && limit.compareAs === "before" ? before : after;
	}

	it("should be after", function(){

		var limit = null;

		var result = getLimit(limit);
		assert.equal(result, after, "Not as expected. Recieved " + result);
	});

	it("should be after", function(){

		var limit = {};

		var result = getLimit(limit);
		assert.equal(result, after, "Not as expected. Recieved " + result);
	});

	it("should be after", function(){

		var limit = {compareAs: false};

		var result = getLimit(limit);
		assert.equal(result, after, "Not as expected. Recieved " + result);
	});

		it("should be after", function(){

		var limit = {compareAs: "after"};

		var result = getLimit(limit);
		assert.equal(result, after, "Not as expected. Recieved " + result);
	});

	it("should be before", function(){

		var limit = {compareAs: "before"};

		var result = getLimit(limit);
		assert.equal(result, before, "Not as expected. Recieved " + result);
	});
});


