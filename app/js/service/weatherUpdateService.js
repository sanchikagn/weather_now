(function () {
    'use strict';

    angular
        .module('app')
        .service('weatherUpdateService', weatherUpdateService);

    weatherUpdateService.$inject = ['$http' , 'serverSettings'];

    function weatherUpdateService($http , serverSettings) {

        var webApi = serverSettings.webApi ;

        var service = {
            update: update
        };

        return service;

        function update(weather) {
            return $http({
                url: webApi + '/update',
                method: "POST",
                data: weather,
                headers: { 'Content-Type': 'application/json' }
            }).then(handleSuccess, handleError('Error'));
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