'use strict';

var mongoose = require('mongoose');

var job = {
    type: String,
    name: String,
    source: String,
    destinations: [String],
    options: {
        extensions: [String],
        recursive: Boolean,
        preserveDirectoryStructure: Boolean,
        limit: {
            value: Number,
            interval: String,
            compareAs: String
        },
        logIgnored: Boolean
    }
};


module.exports = mongoose.model('jobs', mongoose.Schema(job));