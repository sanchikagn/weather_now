(function () {
    'use strict';


    angular
        .module('app')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope' , 'profileService' , '$state', '$http', '$filter', 'serverSettings', '$window', '$rootScope'];
    function profileController($scope , profileService , $state ,$http, $filter, serverSettings, $window, $rootScope) {
        console.log("profile");
        profileService.userDetails.then(function (user) {
                if (user.status === 200) {
                    $scope.profile = user.data;
                    console.log($scope.profile);
                } else {
                    $state.go('app.profile');
                }
            }
        );
    }
})();