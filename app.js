var app = angular.module('app', ['form.builder','lvl.directives.dragdrop','toaster', 'ngAnimate','tab.builder','lvl.services']);
// register the directive with your app module
app.controller('demoController', ['$scope','$rootScope','toaster','uuid','$compile', function($scope, $rootScope, toaster,uuid, $compile) {
    $scope.selectedRows = 7;
    $scope.selectedCols = 7;
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
            closestTr.find("td.selected:first").attr("data-start-tab",id);
            closestTr.find("td.selected").each(function() {
                $(this).addClass("selected_tab")
            });
        }
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

        if($scope.table.find('td').hasClass("selected")) {
            return false;
        }




        if($scope.destionation.closest("tr").is(":last-child")){
            var cloneTr = $scope.destionation.closest("tr").clone();
            var numberOfTd = parseInt($scope.destionation.closest("tr").find("td").length);
            var trString = "<tr>";
            for(var i = 1 ; i <=numberOfTd; i++ ) {
                var td = "<td x-lvl-drop-target='true' x-on-drop='dropped(dragEl, dropEl)' class='selectable'></td>";
                trString = trString + td;
            }

            var tr = angular.element(trString);
            $scope.table.append(tr);
            $compile(tr)($scope);

            $(".maxHeight").scrollTop($scope.table.height());

            if($scope.table.find('td').hasClass("lvl-over")) {
                $scope.table.find('td').removeClass("lvl-over");
            }
        }

        $scope.destionation.addClass("selected marker lastClass");


    };

    $rootScope.$on("LVL-DRAG-START", function() {
        var tableElement = angular.element("#table").find('td').hasClass("selected");
    });


}]);