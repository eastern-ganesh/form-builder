var module = angular.module("fieldgroup.builder", []);

var fieldGroupBuilderController = function($scope) {
    $scope.table;
    $scope.isMouseDownFieldGroup;
    $scope.tabNumberFieldGroup = 0;
    $scope.startElementFieldGroup = null;

    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawingFieldGroup = function(currentTd) {
        $scope.startElementFieldGroup = currentTd;
        $scope.isMouseDownFieldGroup = true;
        $scope.tabNumberFieldGroup = currentTd.closest("tr").attr("data-fielgroup-id");
        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawingFieldGroup = function(element) {
        if ($scope.isMouseDownFieldGroup) {
            var closestTr = angular.element(element).closest("tr");
            if(!closestTr.attr("data-fielgroup-id")) {
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected-fieldgroup");
                    $(this).closest("tr").attr("data-fielgroup-id", $scope.tabNumberFieldGroup);
                });
            } else {
                console.log("Invalid row selection " + closestTr.attr("id"));
                $scope.isMouseDownFieldGroup = false;
                return false;
            }
        }
    };

    $scope.endDrawingFieldGroup = function() {
        var tabName = null;
        if($scope.isMouseDownFieldGroup && $scope.startElementFieldGroup) {
            tabName = $scope.startElementFieldGroup.attr("data-label");
            $scope.startElementFieldGroup.removeAttr("data-label");
            $scope.startElementFieldGroup.parents("td").removeClass("fieldGroupMark");

            var selectedTr = angular.element('*[data-fielgroup-id='+$scope.tabNumberFieldGroup+']');
            selectedTr.each(function (i, j) {
                if((i+1) === selectedTr.length) {
                    $(this).find("td.selected:last").addClass("fieldGroupMark");
                    $(this).find("td.selected:last").find("div").attr("data-label", tabName);
                }
            });
        }

        $scope.isMouseDownFieldGroup = false;
        $scope.tabNumberFieldGroup = 0;
    }





};

module.directive('fieldgroupBuilder', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        replace : true,
        scope : false,
        controller: fieldGroupBuilderController,
        link: function(scope, el, attrs, controller) {

            el.on("mousedown","td.fieldGroupMark",function(e){
                return scope.startDrawingFieldGroup(angular.element(e.target));
            });

            el.on("mouseover","td.selected",function(e){
                return scope.drawingFieldGroup(angular.element(e.target));
            });

            $(document).on('mouseup', function(){
                scope.endDrawingFieldGroup();
            });

            scope.$on('droppedFieldGroup', function(event, args) {
                var destination = angular.element("#" + args.dest);
                var closestTr = destination.closest("tr");

                if(!destination.hasClass("selected")) {
                    alert("Please select table first.")
                    return false;
                }

                if(closestTr.attr("data-fielgroup-id")) {
                    alert("Field Group already selected");
                    return false;
                }

                var fieldGroupNumber = parseInt(scope.table.find("[data-fielgroup-id]").length)+1;
                closestTr.attr("data-fielgroup-id", fieldGroupNumber);
                closestTr.closest("tr").attr("data-fielgroup-id", fieldGroupNumber);
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected-fieldgroup");
                });

                var userFieldGroupName = prompt("Please enter Field Group name.");
                if (userFieldGroupName == null) {
                    userFieldGroupName = "Tab "+userFieldGroupName;
                }
                closestTr.find("td.selected:last").addClass("fieldGroupMark");
                closestTr.find("td.selected:last").find("div").attr("data-label",userFieldGroupName);
            });
        },
    }
}]);