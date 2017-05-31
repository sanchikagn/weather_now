 (function () {
     'use strict';


     angular
        .module('app')
         .controller('rankingController', rankingController);

    rankingController.$inject = ['$scope' , 'rankingService' , '$state', '$http', '$filter', 'serverSettings'];
    function rankingController($scope , rankingService , $state ,$http, $filter, serverSettings) {
        
        $scope.rank=0;
        
        var webApi = serverSettings.webApi;
        rankingService.userDetails.then(function (users) {
            $scope.users = users;
            console.log($scope.users);
        });
    }
 })();