(function(){
	'use strict';

	angular.module("dorin", ['ngRoute', 'toastr'])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/jobs', {
                templateUrl: 'lib/views/job/default.html',
                controller: 'jobController',
                controllerAs: 'jobCtrl'
            })
            .when('/jobs/add', {
                templateUrl: 'lib/views/job/create.html',
                controller: 'jobController',
                controllerAs: 'jobCtrl'
            })
            .when('/jobs/:id/edit', {
                templateUrl: 'lib/views/job/edit.html',
                controller: 'jobController',
                controllerAs: 'jobCtrl'
            })
            .otherwise({
                redirectTo: '/jobs'
            });
    }]);
})();