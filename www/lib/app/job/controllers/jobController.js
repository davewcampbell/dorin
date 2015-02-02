(function(){
	'use strict';

	angular
		.module("dorin")
		.controller("jobController", jobController);


	jobController.$inject = ['$routeParams', '$window', '$location', 'jobService', 'notifyService'];

	function jobController($routeParams, $window, $location, jobService, notifyService){
		var vm = this;
		vm.addJob = addJob;
		vm.deleteJob = deleteJob;
		vm.isAllowedDestinations = isAllowedDestinations;
		vm.jobs = [];
		vm.job = {};
		vm.orderBy = 'name';
		vm.reverse = false;
		vm.saveJob = saveJob;
		vm.setOrder = setOrder;
		vm.title = "Dorin";

		function addJob(){
			jobService
				.addJob(vm.job)
				.then(function (response){
					vm.job = response;
					vm.jobs.push(vm.job);
					$location.url('/');
					notifyService.success("The job was created.", "Success");
					return vm.job;
				})
				.catch(handleError);
		}

		function deleteJob(job){

			var result = $window.confirm("Are you sure you wish to delete this job?");

			if(result){
				jobService
					.deleteJob(job._id)
					.then(function(response){
						var index = vm.jobs.indexOf(job);
						vm.jobs.splice(index, 1);
						notifyService.success("The job was deleted.", "Success");
						return response;
					})
					.catch(handleError);
			}
		}

		function isAllowedDestinations(){
			if(!vm.job) return false;

			if(!vm.job.type) return false;

			if(vm.job.type == 'purge') return false;

			return true;
		}

		function init(){
			if($routeParams.id){

				jobService
					.getJobById($routeParams.id)
					.then(function(response){
						vm.job = response;
						return vm.job;
					})
					.catch(handleError);

			}
			else{

				jobService
					.getAllJobs()
					.then(function(response){
						vm.jobs = response;
						return vm.jobs;
					})
					.catch(handleError);
			}
		}

		function saveJob(){
			jobService
				.saveJob(vm.job)
				.then(function(response){
					vm.job = response;
					$location.url('/');
					notifyService.success("The job has been saved.", "Success");
					return response;
				})
				.catch(handleError);
		}

		function setOrder(property){
			vm.orderBy = property;
			vm.reverse = !vm.reverse;
		}

		function handleError(err){
			console.log(err);
			notifyService.error(err, "Oops!");
		}

		// init
		init();
	}
})();