/**
 * Created by davewcampbell on 15-01-27.
 */

(function(){
    'use strict';

    angular
        .module('dorin')
        .factory('purgeService', purgeService);

    purgeService.$inject = ['$http'];

    function purgeService($http){

        var service = {
            getAllJobs: getAllJobs,
            getJobById: getJobById,
            saveJob: saveJob
        };

        return service;

        ///////

        function getAllJobs(){

            return $http.get('/api/jobs')
                .then(getAllJobsComplete)
                .catch(handleError);
        }

        function getAllJobsComplete(response){
            return response.data;
        }

        function getJobByIdComplete(response){
            return response.data;
        }

        function getJobById(id){

            return $http.get('/api/jobs/' + id )
                .then(getAllJobsComplete)
                .catch(handleError);

        }

        function handleError(err){
            //TODO: handle error
            console.log(err);
        }

        function saveJob(job){

            var url = '/api/jobs/' + job._id;

            $http.put(url, job)
                .success(function(response){
                    return response;
                })
                .error(handleError);
        }
    }

})();
