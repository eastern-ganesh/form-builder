var app = angular.module('app', ['form.builder','lvl.directives.dragdrop']);
// register the directive with your app module
app.controller('demoController', ['$scope','$rootScope', function($scope, $rootScope) {
    $scope.selectedRows = 7;
    $scope.selectedCols = 7;

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    $scope.dropped = function(src, dest) {
        var closestTable = angular.element("#"+dest).closest('table');
        if(closestTable.find('td').hasClass("selected")) {
            return false;
        }

        var destArea = angular.element("#"+dest);
        if(destArea.closest("tr").is(":last-child")){
            var cloneTr = destArea.closest("tr");
            closestTable.append(cloneTr.clone());
            $(".maxHeight").scrollTop(closestTable.height());

            if(closestTable.find('td').hasClass("lvl-over")) {
                closestTable.find('td').removeClass("lvl-over");
            }
        }
        angular.element("#"+dest).addClass("selected marker lastClass");

    };

    $rootScope.$on("LVL-DRAG-START", function() {
        var tableElement = angular.element("#table").find('td').hasClass("selected");
    });


}]);