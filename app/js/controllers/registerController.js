(function () {
    'use strict';


    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope' , 'registerService' , '$state','$window'];

    function registerController($scope , registerService , $state) {
         
        $scope.register = function () {
         registerService.register($scope.details).then(function success(data) {
            if(data.status==200){
                $state.go('app.map');
                window.alert("Success register!");
             }else{
                 $state.go('appSimple.register');
                window.alert("Invalid register!");
             }
         });
        }
    }

})();


