(function(){
	'use strict';

	angular.module("dorin", ['ngRoute'])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'lib/views/purge/default.html',
                controller: 'purgeController'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }]);
})();