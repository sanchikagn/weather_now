(function () {
    'use strict';

    angular
        .module('app')
        .factory('profileService', profileService);

    profileService.$inject = ['$http' , 'serverSettings','$filter'];

    function profileService($http , serverSettings, $filter) {
        var webApi = serverSettings.webApi ;
        console.log(JSON.parse(localStorage.getItem("user")).username);
        return {
            userDetails: $http.get(webApi + '/profile/' + JSON.parse(localStorage.getItem("user")).username).then(function (user) {
                return (user);
            })
        };

    }
})();