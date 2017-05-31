(function () {
    'use strict';


    angular
        .module('app')
       

   .controller('mapController', function($scope, mapService,serverSettings, $http, $state) {

     var webApi = serverSettings.webApi ;
    $scope.place = {};
   
    
    $scope.search = function() {
        $scope.apiError = false;
        mapService.search($scope.searchPlace)
        .then(
            function(res) { // success
                mapService.addMarker(res);
                $scope.place.location = res.name;
                $scope.place.latitude = res.geometry.location.lat();
                $scope.place.longitude = res.geometry.location.lng();
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    };
    $scope.weather = {};
    $scope.send = function(place) {
  
		console.log(place);
		$http({
			url:webApi+'/weather',
			method:"POST",
			data: place,
			headers:{'Content-Type':'application/json'}
			}).then(function(response){
			if(response.status === 200){
                console.log(response.data);
                $scope.weather = response.data;
                console.log($scope.weather);
			}else{
				$state.go('app.map');
				window.alert("Invalid search!");
			}
		});
		
    };
    
    mapService.init();

    });
	
})();