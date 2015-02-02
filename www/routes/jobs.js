'use strict';

var mongoose = require('mongoose');

var dorinJob = require('../../models/dorinJob');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');

// Get all
function getAll(request, response){

    dorinJob.find(function(err, jobs){

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
    var query = dorinJob.where({_id: request.params.id});

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
    dorinJob.create(request.body, function(err, job){
        if(err){
            response.status(500).json(err);
        }
        else{
            var url = "/api/jobs/" + job._id;
            response.status(200).json(url);
        }
    });
}

function deleteJob(request, response){
    dorinJob.remove({_id: request.params.id}, function(err){
        if(err){
            response.status(500).end();
        }
        else{
            response.status(200).end();
        }
    });
}

function saveJob(request, response){
    // TODO: Save request.body to mongo at id supplied
    dorinJob.findOneAndUpdate({_id: request.body._id}, request.body, function(err, result){

        if(err){
            response.status(500).end();
        }
        else{
            response.status(200).json(request.body);
        }
    });
}


module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.getLogById = getLogById;
module.exports.addJob = addJob;
module.exports.saveJob = saveJob;
module.exports.deleteJob = deleteJob;