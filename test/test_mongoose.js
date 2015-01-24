var chai = require('chai');
var expect = chai.expect;

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


        expect(Purge).to.be.ok;

        Purge.find(function(err, jobs){

            expect(err).to.be.undefined;
            expect(jobs).not.to.be.null
            expect(jobs).not.to.be.empty;
            expect(jobs[0]).to.have.property('name');
            expect(jobs[0].name).to.be.ok;

            console.dir(jobs.length);
            done();
        });

    });
});