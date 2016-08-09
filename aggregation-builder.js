var module = angular.module("aggregation.builder", []);

var aggregationBuilderController = function($scope) {
    var mouseDownAggregation = false;
    var closestTrIdAggregation = null;
    var draggedDivContentAggregation = null;
    var startId;

    $scope.startSelectionAggregation = function(element) {
        draggedDivContentAggregation = element.text();
        mouseDownAggregation = true;
        closestTrIdAggregation = element.closest("tr").attr("id");
        startId = element.closest("td").attr("data-aggregation-id");
    };

    $scope.aggregationSelection = function(element) {
        var currentSelection = angular.element(element).parents("td");
        if(mouseDownAggregation && currentSelection.hasClass("selected-field")) {
            mouseDownAggregation = false;
            alert("Field already exist.");
            return false;
        }
        if(mouseDownAggregation && !currentSelection.hasClass("selected-aggregation") &&
            currentSelection.closest("tr").attr("id") === closestTrIdAggregation) {
            currentSelection.addClass("selected-aggregation");
            currentSelection.attr("data-aggregation-id", startId);
            if(draggedDivContentAggregation != null) {
                currentSelection.find("div").html(draggedDivContentAggregation);
            }
        }
    };

    $scope.endAggregationdSelection = function() {
        if(mouseDownAggregation) {
            angular.element('td').removeClass('selected-aggregation-active');
            var selectedTd = angular.element('*[data-aggregation-id='+startId+']');
            selectedTd.addClass("selected-aggregation-active");
            $scope.showAggregationInfo(null);
        }
        mouseDownAggregation = false;
        draggedDivContentAggregation = null;
        closestTrIdAggregation = null;
    };

    /**
     * Show tab info in table
     */
    $scope.showAggregationInfo = function(aggregationNu) {
        startId = (aggregationNu == null) ? startId : aggregationNu;
        var selectedTr = angular.element('*[data-aggregation-id = '+startId+']');
        var tabInformation = { 'id' : startId,
            'name' : selectedTr.first().find("div").html(),
            "row" : parseInt(selectedTr.first().attr("data-rows"))+1,
            "fromCols" : parseInt(selectedTr.first().attr("data-cols"))+1,
            "toCols" : parseInt(selectedTr.last().attr("data-cols"))+1};
        $scope.$emit('updateAggregationInfo', tabInformation);
    };
};

module.directive('aggregationBuilder', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        replace : true,
        controller : aggregationBuilderController,
        scope : false,
        link: function(scope, el, attrs, controller) {
            el.on("mousedown","td.selected-aggregation",function(e){
                return scope.startSelectionAggregation(angular.element(e.target));
            });

            el.on("mouseover","td.selected",function(e){
                scope.aggregationSelection(e.target);
            });

            $(document).on('mouseup', function(){
                scope.endAggregationdSelection();
            });

            scope.$on('droppedAggreation', function(event, destination) {
                if(destination.hasClass("selected-aggregation")) {
                    alert("Aggregation already exist.");
                    return false;
                }
                if(destination.hasClass("selected-field")) {
                    alert("Field already exist.");
                    return false;
                }
                if(destination.hasClass("selected")) {
                    angular.element('td').removeClass('selected-aggregation-active');

                    var numberOfAggregation = parseInt(angular.element(el).find(".selected-aggregation-mark").length)+1;
                    destination.addClass("selected-aggregation selected-aggregation-mark selected-aggregation-active");
                    destination.attr("data-aggregation-id", numberOfAggregation);

                    var userAggregationName = prompt("Please enter aggregation name.");
                    userAggregationName = (userAggregationName == null) ? "Aggregation " : userAggregationName;
                    destination.find("div").html(userAggregationName);
                    scope.showAggregationInfo(numberOfAggregation);
                }
            });
        },
    }
}]);