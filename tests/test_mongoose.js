var assert = require("assert");

describe("Mongoose", function(){


    it("gets data from the test database", function(done){

        var mongoose = require('mongoose');
        var Purge = require('../models/purgeJob');

        var db = mongoose.connection;

        db.on('error', console.error);
        db.once('open', function() {
            // Create your schemas and models here.
        });

        mongoose.connect('mongodb://localhost/test');

        assert.ok(Purge);

        Purge.find(function(err, jobs){

            assert.ifError(err);
            assert.ok(jobs);

            console.dir(jobs.length);
            done();
        });

    });
});