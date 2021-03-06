/**
 * Created by davewcampbell on 15-01-27.
 */

(function(){
    'use strict';

    angular
        .module('dorin')
        .factory('jobService', jobService);

    jobService.$inject = ['$http'];

    function jobService($http){

        var service = {
            addJob: addJob,
            deleteJob: deleteJob,
            getAllJobs: getAllJobs,
            getJobById: getJobById,
            saveJob: saveJob
        };

        return service;

        ///////
        function addJob(job){
            var url = '/api/jobs/';


            return $http.post(url, job)
                .then(addJobComplete)
                .catch(handleError);
        }

        function addJobComplete(response){
            return response.data;
        }

        function deleteJob(id){

            var url = '/api/jobs/' + id;

            return $http.delete(url)
                .then(deleteJobComplete)
                .catch(handleError);
        }

        function deleteJobComplete(response){
            return true;
        }

        function getAllJobs(){

            return $http.get('/api/jobs')
                .then(getAllJobsComplete)
                .catch(handleError);
        }

        function getAllJobsComplete(response){
            return response.data;
        }

        function getJobById(id){

            return $http.get('/api/jobs/' + id )
                .then(getJobByIdComplete)
                .catch(handleError);

        }

        function getJobByIdComplete(response){
            return response.data;
        }

        function handleError(err){
            //TODO: handle error
            console.log(err);
        }

        function saveJob(job){

            var url = '/api/jobs/' + job._id;

            return $http.put(url, job)
                .then(saveJobComplete)
                .catch(handleError);
        }

        function saveJobComplete(response){
            return response.data;
        }
    }

})();
