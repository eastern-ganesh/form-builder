var module = angular.module("field.builder", []);

var fieldBuilderController = function($scope) {
    $scope.mouseDown = false;
    $scope.tabNumber = null;
    $scope.closestTrId = null;

    $scope.startSelectionField = function(element) {
        $scope.draggedDivContent = element.text();
        $scope.mouseDown = true;
        $scope.tabNumber = element.closest("tr").attr("data-tab-id");
        $scope.closestTrId = element.closest("tr").attr("id");
    };

    $scope.fieldSelection = function(element) {
        var currentSelection = angular.element(element).parents("td");
        if($scope.mouseDown && currentSelection.hasClass("selected-aggregation")) {
            $scope.mouseDown = false;
            alert("Aggregation already exist.");
            return false;
        }
        if($scope.mouseDown && !currentSelection.hasClass("selected-field") &&
            currentSelection.closest("tr").attr("id") === $scope.closestTrId) {

            currentSelection.addClass("selected-field");
            if($scope.draggedDivContent != null) {
                currentSelection.find("div").html($scope.draggedDivContent);
            }

        }
    };

    $scope.endFieldSelection = function() {
        $scope.mouseDown = false;
        $scope.tabNumber = null;
        $scope.draggedDivContent = null;
    };
};

module.directive('fieldBuilder', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        replace : true,
        controller : fieldBuilderController,
        scope : false,
        link: function(scope, el, attrs, controller) {

            el.on("mousedown","td.selected-field",function(e){
                return scope.startSelectionField(angular.element(e.target));
            });

            el.on("mouseover","td.selected",function(e){
                scope.fieldSelection(e.target);
            });

            $(document).on('mouseup', function(){
                scope.endFieldSelection();
            });

            scope.$on('droppedField', function(event, args) {
                var destination = angular.element("#" + args.dest);
                if(destination.hasClass("selected-field")) {
                    alert("Field already exist.");
                    return false;
                }
                if(destination.hasClass("selected-aggregation")) {
                    alert("aggregation already exist.");
                    return false;
                }
                if(destination.hasClass("selected")) {
                    angular.element("#"+args.dest).addClass("selected-field");
                    var userFieldName = prompt("Please enter Field name.");
                    if (userFieldName == null) {
                        userFieldName = "Field";
                    }
                    angular.element("#"+args.dest).find("div").html(userFieldName);
                }
            });

        },
    }
}]);