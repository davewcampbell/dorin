(function(){
	'use strict';

	angular
		.module("dorin")
		.controller("purgeController", purgeController);


	function purgeController(){
		var vm = this;
		vm.title = "Dorin";
	}
})();