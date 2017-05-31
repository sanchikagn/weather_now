(function () {
    'use strict';


    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope' , 'loginService' , '$state','$window', '$rootScope'];

    function loginController($scope , loginService , $state, $rootScope) {
         
        $scope.login = function () {
         loginService.login($scope.details).then(function success(data) {
             if(data.status==200){
                 console.log(data.data);
                 localStorage.setItem("user", JSON.stringify(data.data));
                $state.go('app.map');
             }else{
                 $state.go('appSimple.login');
                 window.alert("Invalid login!");
             }
         });
        }
    }

})();