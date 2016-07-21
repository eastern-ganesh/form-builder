var app = angular.module('app', ['form.builder','lvl.directives.dragdrop','toaster', 'ngAnimate','tab.builder','lvl.services']);
// register the directive with your app module
app.controller('demoController', ['$scope','$rootScope','toaster','uuid','$compile', function($scope, $rootScope, toaster,uuid, $compile) {
    $scope.selectedRows = 6;
    $scope.selectedCols = 6;

    $scope.table = angular.element("#table");
    $scope.source;
    $scope.destionation;

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    /**
     * check where table is selected or not
     * @returns {boolean}
     */
    var checkTableIsSelected = function () {
        if($scope.table.find('td').hasClass("selected")) {
            return true;
        }

        return false;
    };

    var doTabSelection = function() {
        if(!$scope.destionation.hasClass("selected")) {
            toaster.error("title", "Please drop on selected table.");
            return false;
        }

        var closestTr = $scope.destionation.closest("tr");

        var id = closestTr.attr("id");
        if (!id) {
            id = uuid.new();
            closestTr.attr("id", id);

            var numberOfTab = parseInt($scope.table.find("[data-start-tab]").length)+1;
            closestTr.find("td.selected:first").html("<span>Tab "+numberOfTab+"</span>");
            closestTr.attr("data-tab-number",numberOfTab);
            closestTr.find("td.selected:first").attr("data-start-tab",id);
            closestTr.find("td.selected").each(function() {
                $(this).addClass("selected_tab")
            });
            angular.element('td.selected_tab').removeClass('lastTabSelect');
            angular.element('.selected_tab').last().addClass("lastTabSelect");

            angular.element('td').removeClass('selected-tab-border');

            closestTr.find('td').each(function () {
                if($(this).hasClass("selected_tab")) {
                    $(this).addClass("selected-tab-border");
                }
            });
        }
    };


    var doFieldSelection = function() {
        if(!$scope.destionation.hasClass("selected")) {
            console.log("Please enter field in table.");
            return false;
        }
        if(!$scope.destionation.hasClass("selected_tab")) {
            console.log("Please enter field in tab.");
            return false;
        }

        if($scope.destionation.hasClass("selected-field")) {
            console.log("Field already present please select another.");
            return false;
        }

        $scope.destionation.addClass("selected-field");
    };

    $scope.dropped = function(src, dest) {
        $scope.destionation = angular.element("#"+dest);
        $scope.source = angular.element("#"+src);

        if(src == "tab") {
            if(checkTableIsSelected() == false) {
                toaster.error("title", "Please select table before drag anything.");
                console.log("Please select table.");
                return false;
            }
            doTabSelection();
            return false;
        }

        if(src == "field") {
            doFieldSelection();
            return false;
        }

        if($scope.table.find('td').hasClass("selected")) {
            return false;
        }

        if(src == "table_button") {
            $scope.$broadcast ('droppedTable', {"src" : src, "dest" : dest});
        }

    };
}]);