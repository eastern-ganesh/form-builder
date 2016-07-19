var module = angular.module("tab.builder", []);

var tabBuilderController = function($scope) {

    $scope.table;
    $scope.isMouseDown;

    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawing = function(currentTd) {
        $scope.isMouseDown = true;
        currentTd.addClass("selected_tab").addClass('recentTab');

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
            console.log(currentTd);
            var closestTr = currentTd.closest("tr");


            closestTr.find("td.selected").each(function() {
                $(this).addClass("selected_tab");
            });

        }

    };

    $scope.endDrawing = function(e) {
        $scope.isMouseDown = false;

        angular.element('.selected_tab').last().addClass("lastClassTab");

        var text = $('#tab_info');
        text.html("");
        var lastElement = $( ".selected_tab" ).last();
        var firstElement = $( ".selected_tab" ).first();

        var toRows = parseInt(lastElement.attr("data-rows"))+1;
        var toCols = parseInt(lastElement.attr("data-cols"))+1;

        var fromRows = parseInt(firstElement.attr("data-rows"))+1;
        var fromCols = parseInt(firstElement.attr("data-cols"))+1;

        text.prepend("From Rows " + fromRows + "   To rows " + toRows + "<br>" + " From cols " + fromCols + "   to Cols " + toCols );
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
                var currentTd = angular.element(e.target);
                return scope.startDrawing(currentTd);
            });

            el.on("mouseover","td.selected",function(e){
                var currentTd = angular.element(e.target);
                scope.drawing(e.target);
            });

            el.on("mouseup", function(e){
                scope.endDrawing(e);
            });

        }

    }
}]);
