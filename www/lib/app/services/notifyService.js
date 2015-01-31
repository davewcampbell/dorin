/**
 * Created by davewcampbell on 15-01-30.
 */

(function(){
    'use strict';

    angular
        .module('dorin')
        .factory('notifyService', notifyService);

    notifyService.$inject = ['toastr'];

    function notifyService(toastr){
        var service = {
            error: toastr.error,
            info: toastr.info,
            success: toastr.success,
            warning: toastr.warning
        };

        return service;
    }
})();
