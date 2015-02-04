'use strict';

var filesRoute = require('../routes/files');
var jobsRoute = require('../routes/jobs');


module.exports = function(router){

    // Define Files routes
    router.get('/api/file/:id?', filesRoute.getById);
    router.post('/api/file', filesRoute.save);

    //Define the Jobs routes for CRUD
    router.get('/api/jobs', jobsRoute.getAll);
    router.get('/api/jobs/:id', jobsRoute.getById);
    router.get('/api/jobs/type/:type', jobsRoute.getByType);
    router.post('/api/jobs', jobsRoute.addJob);
    router.put('/api/jobs/:id', jobsRoute.saveJob);
    router.delete('/api/jobs/:id', jobsRoute.deleteJob);

    // Default
    router.get("/", function(request, response){
        response.render('index');
    });
}