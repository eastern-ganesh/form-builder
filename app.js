
var app = angular.module('app', ['form.builder']);
 // register the directive with your app module
        app.controller('demoController', ['$scope', function($scope) { 
            $scope.selectedRows = 7;
            $scope.selectedCols = 7;
            
            $scope.getNumber = function(num) {
                return new Array(num);   
            }
}]);