'use strict';

var mongoose = require('mongoose');

var job = {
    id: String,
    name: String,
    source: String,
    options: {
        extensions: [String],
        recursive: Boolean,
        limit: {
            value: Number,
            interval: String,
            compareAs: String
        },
        logIgnored: Boolean
    }
};


module.exports = mongoose.model('jobs', mongoose.Schema(job));