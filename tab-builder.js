var module = angular.module("tab.builder", ['lvl.services']);

var tabBuilderController = function($scope) {
    $scope.table;
    $scope.isMouseDown;
    $scope.tabNumber = 0;

    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawing = function(currentTd) {
        $scope.isMouseDown = true;
        $scope.tabNumber = currentTd.closest("tr").attr("data-tab-id");

        angular.element('td').removeClass('selected-tab-active');
        var selectedTr = angular.element('*[data-tab-id='+$scope.tabNumber+']');

        selectedTr.find('td').each(function () {
            if($(this).hasClass("selected_tab")) {
                $(this).addClass("selected-tab-active");
            }
        });
        $scope.showTabInfo();
        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawing = function(element) {
        if ($scope.isMouseDown) {
            var closestTr = angular.element(element).closest("tr");
            if(!closestTr.attr("data-tab-id")) {
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected_tab");
                    $(this).closest("tr").attr("data-tab-id", $scope.tabNumber);
                });
            } else {
                console.log("Invalid row selection " + closestTr.attr("id"));
                $scope.isMouseDown = false;
                return false;
            }
        }
    };

    $scope.endDrawing = function() {
        $scope.isMouseDown = false;
        angular.element('td').removeClass('lastTabSelect');
        angular.element('.selected_tab').last().addClass("lastTabSelect");
        $scope.showTabInfo();
    }

    /**
     * update tab name
     * @param tabName
     */
    $scope.updateTabName = function (tabName) {
        console.log($scope.tabNumber);
        if($scope.tabNumber) {
            var selectedTr = angular.element('*[data-tab-number='+$scope.tabNumber+']');
            selectedTr.first().find("td:first").find("div").html(tabName);
        }
    }

    /**
     * Show tab info in table
     */
    $scope.showTabInfo = function() {
        angular.element("#orderTab").html($scope.tabNumber);
        var selectedTr = angular.element('*[data-tab-id = '+$scope.tabNumber+']');

        angular.element("#tabFromRaw").html(parseInt(selectedTr.first().find("td:first").attr("data-rows"))+1);
        angular.element("#tabtoRaw").html(parseInt(selectedTr.last().find("td:first").attr("data-rows"))+1);

        angular.element("#tabFromCols").html(1);
        angular.element("#tabtoCols").html(selectedTr.first().find("td").length);

        var tabName = selectedTr.first().find("td:first").find("span").html();
        angular.element("#tabName").val(tabName);
    };
};

module.directive('tabBuilder', ['$rootScope','uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        replace : true,
        scope : {},
        controller: tabBuilderController,
        link: function(scope, el, attrs, controller) {

            scope.table = angular.element(el);

            el.on("mousedown","td.tabMark",function(e){
                return scope.startDrawing(angular.element(e.target));
            });

            el.on("mouseover","td.selected",function(e){
                scope.drawing(angular.element(e.target));
            });

            $(document).on('mouseup', function(){
                scope.endDrawing();
            });

            el.on("selectstart","td.selected",function(e){
                return false;
            });

            scope.$on('droppedTab', function(event, args) {
                var destination = angular.element("#"+args.dest);
                var closestTr = destination.closest("tr");
                if(!destination.hasClass("selected")) {
                    alert("Please select table first.")
                    return false;
                }

                if(closestTr.attr("data-tab-id")) {
                    alert("Tab already selected");
                    return false;
                }

                var tabNumber = parseInt(scope.table.find("[data-tab-number]").length)+1;
                closestTr.attr("data-tab-number", tabNumber);
                closestTr.closest("tr").attr("data-tab-id", tabNumber);
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected_tab");
                });

                var userTabName = prompt("Please enter tab Name.");
                if (userTabName == null) {
                    userTabName = "Tab "+tabNumber;
                }

                closestTr.find("td.selected:first").find("div").attr("data-label", userTabName);
                angular.element("#tabName").val(userTabName);

                closestTr.find("td.selected:first").addClass("tabMark");
                angular.element('td.selected_tab').removeClass('lastTabSelect');
                angular.element('.selected_tab').last().addClass("lastTabSelect");
                angular.element('td').removeClass('selected-tab-active');

                closestTr.find('td').each(function () {
                    if($(this).hasClass("selected_tab")) {
                        $(this).addClass("selected-tab-active");
                    }
                });
            });

            scope.$on('updateTabName', function (event, args) {
                scope.updateTabName(args.tabName);
            });
        }
    }
}]);
