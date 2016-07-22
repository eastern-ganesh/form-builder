var app = angular.module('app', ['form.builder','lvl.directives.dragdrop','tab.builder']);
// register the directive with your app module
app.controller('demoController', ['$scope', function($scope) {
    $scope.selectedRows = 6;
    $scope.selectedCols = 6;

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    $scope.dropped = function(src, dest) {
        if(src == "table_button") {
            $scope.$broadcast ('droppedTable', {"src" : src, "dest" : dest});
        }
        if(src == "tab") {
            $scope.$broadcast ('droppedTab', {"src" : src, "dest" : dest});
        }

        if(src == "field") {
            console.log("Field dragged here");
            return false;
        }
    };

}]);