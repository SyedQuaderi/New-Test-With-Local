var app = angular.module('myApp', [ ]);
    app.controller('technologiesCtrl',['$scope', '$http', '$log', '$location', '$interval', function($scope, $http, $log, $location, $interval) {
        $http.get("../src/js/files.JSON").then(function(response) {
            $scope.myFiles = response.data.items;
            $log.info("new value:", $scope.myFiles);           
        });
    }]);