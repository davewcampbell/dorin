var request = require("supertest");
var assert = require("assert");

var app = require("../app");


describe("Files routes", function(){


	it("get root should return 200", function(done){
		request(app)
			.get("/")
			.expect(200, done)
	});

	it("get file by id should return success", function(done){
		request(app)
			.get('/file/_5ad6a17cb3c54643bc7c4d62d7f2b5cc-1418935565326.txt')
			.expect(200, done);
	});
});

describe("post a file to a URL", function(){

	var fname = 'C:\\Temp\\files\\Weeklies.zip';
	var dests = ["http://localhost:3000/file"];
	var folderpost = require("../tasks/folderpost");

	it("should return a success", function(done){
		
		var resp = folderpost.post(fname, dests, {}, function(err){
			console.log(err);
			done();
		});
		
	});
});