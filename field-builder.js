var module = angular.module("field.builder", []);

var fieldBuilderController = function($scope) {
    var mouseDownField = false;
    var closestTrId = null;
    var draggedDivContent;
    var startId;

    $scope.startSelectionField = function(element) {
        draggedDivContent = element.text();
        mouseDownField = true;
        closestTrId = element.closest("tr").attr("id");
        startId = element.closest("td").attr("data-field-id");
    };

    $scope.fieldSelection = function(element) {
        var currentSelection = angular.element(element).parents("td");
        if(mouseDownField && currentSelection.hasClass("selected-aggregation")) {
            mouseDownField = false;
            alert("Aggregation already exist.");
            return false;
        }
        if(mouseDownField && !currentSelection.hasClass("selected-field") &&
            currentSelection.closest("tr").attr("id") === closestTrId) {

            currentSelection.addClass("selected-field");
            currentSelection.attr("data-field-id", startId);
            if(draggedDivContent != null) {
                currentSelection.find("div").html(draggedDivContent);
            }
        }
    };

    $scope.endFieldSelection = function() {
        if(mouseDownField) {
            angular.element('td').removeClass('selected-field-active');
            var selectedTd = angular.element('*[data-field-id='+startId+']');
            selectedTd.addClass("selected-field-active");
            $scope.showFieldInfo(null);
        }
        mouseDownField = false;
        draggedDivContent = null;
    };

    /**
     * Show tab info in table
     */
    $scope.showFieldInfo = function(fieldNu) {
        startId = (fieldNu == null) ? startId : fieldNu;
        console.log(startId);
        var selectedTr = angular.element('*[data-field-id = '+startId+']');
        var tabInformation = { 'id' : startId,
            'name' : selectedTr.first().find("div").html(),
            "row" : parseInt(selectedTr.first().attr("data-rows"))+1,
            "fromCols" : parseInt(selectedTr.first().attr("data-cols"))+1,
            "toCols" : parseInt(selectedTr.last().attr("data-cols"))+1};
        $scope.$emit('updateFieldInfo', tabInformation);
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

            scope.$on('droppedField', function(event, destination) {
                if(destination.hasClass("selected-field")) {
                    alert("Field already exist.");
                    return false;
                }
                if(destination.hasClass("selected-aggregation")) {
                    alert("aggregation already exist.");
                    return false;
                }
                if(destination.hasClass("selected")) {
                    angular.element('td').removeClass('selected-field-active');
                    var numberOfField = parseInt(angular.element(el).find(".selected-field-mark").length)+1;
                    destination.addClass("selected-field selected-field-mark selected-field-active");
                    destination.attr("data-field-id", numberOfField);

                    destination.addClass("selected-field");
                    var userFieldName = prompt("Please enter tab Name.");
                    userFieldName = (userFieldName == null) ? "Field " : userFieldName;
                    destination.find("div").html(userFieldName);
                    scope.showFieldInfo(numberOfField);
                }
            });
        },
    }
}]);