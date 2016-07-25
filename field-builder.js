var module = angular.module("field.builder", []);

var fieldBuilderController = function($scope) {
    $scope.mouseDown = false;
    $scope.tabNumber = null;

    $scope.startSelectionField = function(element) {
        $scope.mouseDown = true;
        $scope.tabNumber = element.closest("tr").attr("data-tab-id");
    };

    $scope.fieldSelection = function(element) {
        var currentSelection = angular.element(element);
        var currenttabNumber = currentSelection.closest("tr").attr("data-tab-id");
        if($scope.mouseDown && !currentSelection.hasClass("selected-field") && currenttabNumber == $scope.tabNumber) {
            console.log(currenttabNumber);
            console.log(currenttabNumber == $scope.tabNumber);
            
            currentSelection.addClass("selected-field");
        }
    };

    $scope.endFieldSelection = function() {
        $scope.mouseDown = false;
        $scope.tabNumber = null;
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

            el.on("mouseover","td.selected_tab",function(e){
                scope.fieldSelection(e.target);
            });

            $(document).on('mouseup', function(){
                scope.endFieldSelection();
            });

            scope.$on('droppedField', function(event, args) {
                var destination = angular.element("#" + args.dest);
                if(destination.hasClass("selected") && destination.hasClass("selected_tab")) {
                    angular.element("#"+args.dest).addClass("selected-field");
                }
            });

        },
    }
}]);