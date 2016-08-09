var app = angular.module('app', ['form.builder','lvl.directives.dragdrop','tab.builder','field.builder','aggregation.builder','fieldgroup.builder']);
// register the directive with your app module
app.controller('demoController', ['$scope', function($scope) {
    var vm = this;
    $scope.selectedRows = 6;
    $scope.selectedCols = 7;
    $scope.tabName = "Tab 1";

    $scope.formInfo = {"rows":0,"cols":0};
    $scope.tabInfo = [];
    $scope.fieldGroupInfo = [];
    $scope.aggregationInfo = [];
    $scope.fieldInfo = [];



    $scope.getNumber = function(num) {
        return new Array(num);
    };

    $scope.dropped = function(src, dest) {

        if(src == "table_button") {
            $scope.$broadcast ('droppedTable', {"src" : src, "dest" : dest});
        }
        if(src == "tab") {
            $scope.$broadcast ('droppedTab', angular.element("#"+dest));
        }

        if(src == "field") {
            $scope.$broadcast ('droppedField', angular.element("#"+dest));
            return false;
        }

        if(src == "aggregation") {
            $scope.$broadcast ('droppedAggreation', angular.element("#"+dest));
            return false;
        }

        if(src == "field_group") {
            $scope.$broadcast ('droppedFieldGroup', angular.element("#"+dest));
            return false;
        }
    };

    $scope.updateTabName = function() {
        $scope.$broadcast ('updateTabName', {"tabName" : $scope.tabInfo.name});
    }

    $scope.updateGroupName = function() {
        $scope.$broadcast ('updateGroupName', {"tabName" : $scope.fieldGroupInfo.name});
    }

    $scope.$on('updateTabInfo', function (event, args) {
        $scope.tabInfo = args;
        $scope.$apply();
        updateTabInfo("li-tab", "menu1");
    });

    $scope.$on('updateFieldGroupInfo', function (event, args) {
        $scope.fieldGroupInfo = args;
        $scope.$apply();
        updateTabInfo("li-fieldgroup", "menu3");
    });

    $scope.$on('updateAggregationInfo', function (event, args) {
        $scope.aggregationInfo = args;
        $scope.$apply();
        updateTabInfo("li-aggregation", "menu4");
    });

    $scope.$on('updateFieldInfo', function (event, args) {
        $scope.fieldInfo = args;
        $scope.$apply();
        updateTabInfo("li-field", "menu2");
    });

    function updateTabInfo(tabId, paneId) {
        angular.element("#tab-information").find("li").removeClass("active");
        angular.element(".tab-content").find("div").removeClass("active in");

        angular.element("#"+tabId).addClass("active");
        angular.element("#"+paneId).addClass("active in");
    }

}]);