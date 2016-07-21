var module = angular.module("tab.builder", []);

var tabBuilderController = function($scope) {
    $scope.table;
    $scope.isMouseDown;
    $scope.tabNumber;

    $scope.showTabInfo = function() {
        angular.element("#orderTab").html($scope.tabNumber);
        var selectedTr = angular.element('*[data-tab-number='+$scope.tabNumber+']');
        angular.element("#tabFromRaw").html(parseInt(selectedTr.first().find("td:first").attr("data-rows"))+1);
        angular.element("#tabtoRaw").html(parseInt(selectedTr.last().find("td:first").attr("data-rows"))+1);

        angular.element("#tabFromCols").html(1);
        angular.element("#tabtoCols").html(selectedTr.first().find("td").length);
    };


    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawing = function(currentTd) {
        $scope.isMouseDown = true;
        currentTd.addClass("selected_tab");
        $scope.tabNumber = currentTd.closest("tr").attr("data-tab-number");

        if(currentTd.hasClass("selected_tab")) {
            angular.element('td').removeClass('selected-tab-border');

            var selectedTr = angular.element('*[data-tab-number='+$scope.tabNumber+']');
            selectedTr.find('td').each(function () {
               if($(this).hasClass("selected_tab")) {
                   $(this).addClass("selected-tab-border");
               }
            });

            $scope.showTabInfo();

        }
        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawing = function(element) {
        var currentTd = angular.element(element);
        if ($scope.isMouseDown && currentTd.hasClass("selected")) {
            var closestTr = currentTd.closest("tr");
            closestTr.find("td.selected").each(function() {
                $(this).addClass("selected_tab");
                $(this).closest("tr").attr("data-tab-number", $scope.tabNumber)
            });
        }
    };

    $scope.endDrawing = function() {
        $scope.isMouseDown = false;
        angular.element('td.selected_tab').removeClass('lastTabSelect');
        angular.element('.selected_tab').last().addClass("lastTabSelect");

        $scope.showTabInfo();
    }

};

module.directive('tabBuilder', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        replace : true,
        scope : {},
        controller: tabBuilderController,
        link: function(scope, el, attrs, controller) {

            scope.table = angular.element(el);

            el.on("mousedown","td.selected_tab",function(e){
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
        }

    }
}]);
