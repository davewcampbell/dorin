(function(){
	'use strict';

	angular
		.module("dorin")
		.controller("purgeController", purgeController);


	function purgeController($http, $routeParams){
		var vm = this;
		vm.title = "Dorin";
		vm.submit = submit;
		vm.jobs = [];
		vm.job = {};


		function submit(){
			console.log("submitted");
		}

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
})();