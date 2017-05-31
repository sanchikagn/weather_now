(function () {
    'use strict';


    angular
        .module('app')
        .controller('weatherUpdateController', weatherUpdateController);

    weatherUpdateController.$inject = ['$scope' ,'weatherUpdateService', '$state','$window', '$q'];

    function weatherUpdateController($scope  ,weatherUpdateService, $state, $window, $q) {
        var map = document.getElementById("map")
        var places = new google.maps.places.PlacesService(map);
        function search(str){
            var d = $q.defer();
            places.textSearch({query: str}, function(results, status) {
                if (status == 'OK') {
                    d.resolve(results[0]);
                }
                else d.reject(status);
            });
            return d.promise;
        }
        var latitude= 0, longitude= 0;
        $scope.update = function() {
                $scope.apiError = false;
                search($scope.searchPlace)
                    .then(
                        function(res) { // success
                            $scope.weather.location = res.name;
                            $scope.weather.latitude = res.geometry.location.lat();
                            $scope.weather.longitude = res.geometry.location.lng();
                            console.log('User: ' +JSON.parse(localStorage.getItem("user")).username);
                            $scope.weather.username = JSON.parse(localStorage.getItem("user")).username;
                            console.log($scope.weather);
                            weatherUpdateService.update($scope.weather).then(function success(data) {
                                if(data.status==200){
                                    $state.go('app.map');
                                }else{
                                    $state.go('app.weatherUpdate');
                                    swal({
                                        type: "error",
                                        title: "Error!",
                                        text: "Invalid update",
                                        confirmButtonText: "OK"
                                    });
                                }
                            });
                        },
                        function(status) { // error
                            $scope.apiError = true;
                            $scope.apiStatus = status;
                        }
                    );
        }
    }
})();

