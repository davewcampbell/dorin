(function(){
	'use strict';

	angular
		.module("dorin")
		.controller("purgeController", purgeController);


	function purgeController($http, $routeParams){
		var vm = this;
		vm.title = "Dorin";
		vm.saveJob = saveJob;
		vm.addJob = addJob;
		vm.jobs = [];
		vm.job = {};


		function saveJob(){
			var url = '/api/jobs/' + $routeParams.id ;
			$http.put(url, vm.job)
				.success(function(response){

				})
				.error(function(err){
					console.log(err);
				});
		}

		function addJob(){
			var url = '/api/jobs/';


			$http.post(url, vm.job)
				.success(function(response){

				})
				.error(function(err){
					console.log(err);
				});
		}

		function init(){
			if($routeParams.id){

				$http.get('/api/jobs/' + $routeParams.id )
					.success(function(response){
						vm.job = response;
					})
					.error(function(err){
						console.log(err);
					});
			}
			else{

				$http.get('/api/jobs')
					.success(function(response){
						vm.jobs = response;
					});
			}
		}

		// init
		init();
	}
})();