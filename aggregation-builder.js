var module = angular.module("aggregation.builder", []);

var aggregationBuilderController = function($scope) {
    $scope.mouseDownAggregation = false;
    $scope.tabNumber = null;
    $scope.closestTrIdAggregation = null;

    $scope.startSelectionAggregation = function(element) {
        $scope.draggedDivContentAggregation = element.text();
        $scope.mouseDownAggregation = true;
        $scope.closestTrIdAggregation = element.closest("tr").attr("id");
    };

    $scope.aggregationSelection = function(element) {
        var currentSelection = angular.element(element).parents("td");
        if($scope.mouseDownAggregation && currentSelection.hasClass("selected-field")) {
            $scope.mouseDownAggregation = false;
            alert("Field already exist.");
            return false;
        }
        if($scope.mouseDownAggregation && !currentSelection.hasClass("selected-aggregation") && currentSelection.closest("tr").attr("id") === $scope.closestTrIdAggregation) {
            currentSelection.addClass("selected-aggregation");
            if($scope.draggedDivContentAggregation != null) {
                currentSelection.find("div").html($scope.draggedDivContentAggregation);
            }
        }
    };

    $scope.endAggregationdSelection = function() {
        $scope.mouseDownAggregation = false;
        $scope.draggedDivContentAggregation = null;
        $scope.closestTrIdAggregation = null;
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

            scope.$on('droppedAggreation', function(event, args) {
                var destination = angular.element("#" + args.dest);
                if(destination.hasClass("selected-aggregation")) {
                    alert("Aggregation already exist.");
                    return false;
                }
                if(destination.hasClass("selected-field")) {
                    alert("Field already exist.");
                    return false;
                }
                if(destination.hasClass("selected")) {
                    angular.element("#"+args.dest).addClass("selected-aggregation");
                    var userAggregationName = prompt("Please enter aggregation name.");
                    if (userAggregationName == null) {
                        userAggregationName = "Field";
                    }
                    angular.element("#"+args.dest).find("div").html(userAggregationName);
                }
            });
        },
    }
}]);