(function(){
	'use strict';

	angular.module("dorin", ['ngRoute'])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/jobs', {
                templateUrl: 'lib/views/purge/default.html',
                controller: 'purgeController'
            })
            .when('/jobs/add', {
                templateUrl: 'lib/views/purge/create.html',
                controller: 'purgeController'
            })

            .when('/jobs/:id/edit', {
                templateUrl: 'lib/views/purge/edit.html',
                controller: 'purgeController'
            })
            .otherwise({
                redirectTo: '/jobs'
            });
    }]);
})();