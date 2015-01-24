'use strict';

var bodyparser = require('body-parser');
var multer = require('multer');
var path = require("path");


var multerOptions = {
    sizeLimit: function () {
        return 500 * 1000000;
    }
};

module.exports = function(app, express, router, rootPath){

    // expose the static files in lib
    app.use(express.static(path.join(rootPath, 'public')));

    // body parser set up
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: true}));

    // define the uploads directory
    app.use('/api/file', multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase() + "-" + Date.now();
        },
        limits:{
            fileSize: multerOptions.sizeLimit()
        }
    }));


    //run for every request, just console logging
    router.use(function(request, response, next) {

        // log each request to the console
        console.log(request.method, request.url, " - ", new Date());
        // continue doing what we were doing and go to the route
        next();
    });

    //apply our routes
    app.use('/', router);


}