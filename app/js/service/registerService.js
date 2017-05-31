(function () {
    'use strict';

    angular
        .module('app')
        .factory('registerService', registerService);

    registerService.$inject = ['$http' , 'serverSettings'];

    function registerService($http , serverSettings) {


        var webApi = serverSettings.webApi ;

        var service = {
            register: register
        };

        return service;

        function register(details) {
            return $http({
                url: webApi + '/signup',
                method: "POST",
                data: details,
                headers: { 'Content-Type': 'application/json' }
            }).then(handleSuccess, handleError('Error register'));
        }

        function handleSuccess(res) {
            return res;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }



    }
})();
