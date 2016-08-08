var app = angular.module('app', ['form.builder','lvl.directives.dragdrop','tab.builder','field.builder','aggregation.builder','fieldgroup.builder']);
// register the directive with your app module
app.controller('demoController', ['$scope', function($scope) {
    var vm = this;
    $scope.selectedRows = 6;
    $scope.selectedCols = 7;
    $scope.tabName = "Tab 1";

    $scope.formInfo = {"rows":0,"cols":0};
    $scope.tabInfo = [];


    $scope.getNumber = function(num) {
        return new Array(num);
    };

    $scope.dropped = function(src, dest) {

        if(src == "table_button") {
            $scope.$broadcast ('droppedTable', {"src" : src, "dest" : dest});
        }
        if(src == "tab") {
            $scope.$broadcast ('droppedTab', {"src" : src, "dest" : dest});
        }

        if(src == "field") {
            $scope.$broadcast ('droppedField', {"src" : src, "dest" : dest});
            return false;
        }

        if(src == "aggregation") {
            $scope.$broadcast ('droppedAggreation', {"src" : src, "dest" : dest});
            return false;
        }

        if(src == "field_group") {
            $scope.$broadcast ('droppedFieldGroup', {"src" : src, "dest" : dest});
            return false;
        }
    };

    $scope.updateTabName = function() {
        $scope.$broadcast ('updateTabName', {"tabName" : $scope.tabName});
    }

    $scope.showInformationOfTab = function() {
        console.log($scope.tabInfo);
    }

    $scope.$on('updateTabInfo', function (event, args) {
        angular.element("#orderTab").html(args.id);
        angular.element("#tabFromRaw").html(args.fromRow);
        angular.element("#tabtoRaw").html(args.toRow);
        angular.element("#tabName").val(args.name);
    });
}]);