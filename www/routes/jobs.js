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
    var query = Purge.where({id: request.params.id});

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
}



module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.getLogById = getLogById;