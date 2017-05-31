(function () {
    'use strict';

    angular
        .module('app')
        .factory('rankingService', rankingService);

    rankingService.$inject = ['$http' , 'serverSettings','$filter'];

    function rankingService($http , serverSettings, $filter) {
         var webApi = serverSettings.webApi ;

        return {
            userDetails: $http.get(webApi + '/leaderboard').then(function (response) {
                console.log(response.data.leaderboard);
                return (response.data.leaderboard);
            })
        };

    }
})();
