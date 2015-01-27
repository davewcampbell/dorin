'use strict';

var mongoose = require('mongoose');

var Purge = require('../../models/purgeJob');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');

// Get all
function getAll(request, response){

    Purge.find(function(err, jobs){

        if(err){
            response.status(500).end(err);
        }
        else {
            response.json(jobs);
        }
    });
}

// Get By Id
function getById(request, response){
    // create the query
    var query = Purge.where({_id: request.params.id});

    // find the one entry by Id
    query.findOne(function(err, job){

        if(err){
            response.status(500).end(err);
        }
        else {
            response.json(job);
        }
    });
}

function getLogById(request, response){
    var path = '/jobs/purge/logs/' + request.params.id;
    // TODO: Get latest log file and return json
}

function addJob(request, response){
    //TODO: save request.body to mongo as new object
    //TODO: Include URL of newly created item in response
    Purge.insert(request.params);
    var url = "/api/jobs/" + request.params._id;
    response.status(200).end();

}

function saveJob(request, response){
    // TODO: Save request.body to mongo at id supplied
    response.status(200).end();
}


module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.getLogById = getLogById;
module.exports.addJob = addJob;
module.exports.saveJob = saveJob;