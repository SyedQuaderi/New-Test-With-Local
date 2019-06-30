/*var myApp = angular.module('myApp', ['ngMessages', 'ngResource']);
myApp.controller('mainController', ['$scope', '$log', '$filter', '$resource', function($scope, $log, $filter, $resource){
            
    $scope.name = "faisal";
    
    $scope.formattedname = $filter('uppercase')($scope.name);
    
    $log.info($scope.name);
    $log.info($scope.formattedname);
     
    $log.info($resource);
    $log.warn("this is a new Message");
    
}]);*/

var app = angular.module('myApp', [ ]);
    app.controller('technologiesCtrl',['$scope', '$http', '$log', '$location', '$interval', function($scope, $http, $log, $location, $interval) {
        $http.get("../src/js/files.JSON").then(function(response) {
            $scope.myData = response.data;
            $log.info("new value:", $scope.myData);
            $scope.currentSize = $scope.myData[2];    
            $log.info("new value:", $scope.currentSize);
        });
       
        $scope.currentSuburb = ""; 
        $scope.home = "<Home/>";
        $scope.about = "<About/>";
        $scope.contact = "<Contact/>";
        $scope.start = "<start/>";
        var c=0;
            $scope.message="I'm a Web Developer";
            var timer=$interval(function(){
            $scope.message="I'm a Front-End Web Developer";
            c++;
            },100);

            $scope.killtimer=function(){
            if(angular.isDefined(timer))
                {
                    $interval.cancel(timer);
                    timer=undefined;
                }
        };
        
    }]);
    
    app.filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')

      return $sce.trustAsHtml(text)
    }
  });
