(function(){
	'use strict';

	angular
		.module("dorin")
		.controller("purgeController", purgeController);


	purgeController.$inject = ['$routeParams', 'purgeService'];

	function purgeController($routeParams, purgeService){
		var vm = this;
		vm.addJob = addJob;
		vm.jobs = [];
		vm.job = {};
		vm.orderBy = 'name';
		vm.reverse = false;
		vm.saveJob = saveJob;
		vm.setOrder = setOrder;
		vm.title = "Dorin";

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

				purgeService
					.getJobById($routeParams.id)
					.then(function(response){
						vm.job = response;
						return vm.job;
					})

			}
			else{

				purgeService
					.getAllJobs()
					.then(function(response){
						vm.jobs = response;
						return vm.jobs;
					});
			}
		}

		function saveJob(){
			purgeService
				.saveJob(vm.job)
				.then(function(response){
					vm.job = response;
					return response;
				});
		}

		function setOrder(property){
			vm.orderBy = property;
			vm.reverse = !vm.reverse;
		}

		// init
		init();
	}
})();