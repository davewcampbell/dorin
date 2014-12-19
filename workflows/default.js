'use strict';

var logger = require('../logger');

// load workflow configuration
// set up an event to fire every N seconds
// In the event, move all targeted files to the in process folder
// For each file in process folder, loop through and post to http
// When response is returned, on success, delete file. On error, add to error folder
// Get the file's URL and create a new task for each destination that moves the file
