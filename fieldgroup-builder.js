var module = angular.module("fieldgroup.builder", []);

var fieldGroupBuilderController = function($scope) {
    var isMouseDownField;
    var fieldGroupNumber = 0;
    var startElement;

    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawingFieldGroup = function(currentTd) {
        startElement = currentTd;
        isMouseDownField = true;
        fieldGroupNumber = currentTd.closest("tr").attr("data-fielgroup-id");
        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawingFieldGroup = function(element) {
        if (isMouseDownField) {
            var closestTr = angular.element(element).closest("tr");
            if(!closestTr.attr("data-fielgroup-id")) {
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected-fieldgroup");
                    $(this).closest("tr").attr("data-fielgroup-id", fieldGroupNumber);
                });
            } else {
                console.log("Invalid row selection " + closestTr.attr("id"));
                isMouseDownField = false;
                return false;
            }
        }
    };

    /**
     * set information when drawing end
     */
    $scope.endDrawingFieldGroup = function() {
        var tabName = null;
        if(isMouseDownField && startElement) {
            tabName = startElement.attr("data-label");
            startElement.removeAttr("data-label");
            startElement.parents("td").removeClass("fieldGroupMark");
            angular.element('td').removeClass('selected-fieldgroup-active');

            var selectedTr = angular.element('*[data-fielgroup-id='+ fieldGroupNumber+']');
            selectedTr.find("td.selected-fieldgroup").addClass("selected-fieldgroup-active");
            selectedTr.last().find("td.selected:last").addClass("fieldGroupMark");
            selectedTr.last().find("td.selected:last").find("div").attr("data-label", tabName);
            $scope.showFieldGroupInfo(null);

        }
        isMouseDownField = false;
        fieldGroupNumber = 0;
    }

    /**
     * Show tab info in table
     */
    $scope.showFieldGroupInfo = function(tabNu) {
       fieldGroupNumber = (tabNu != null) ? tabNu : fieldGroupNumber;
        var selectedTr = angular.element('*[data-fielgroup-id = '+fieldGroupNumber+']');
        var tabInformation = { 'id' : fieldGroupNumber,
            'name' : selectedTr.last().find("td.selected-fieldgroup:last").find("div").attr("data-label"),
            "fromRow" : parseInt(selectedTr.first().find("td.selected-fieldgroup").attr("data-rows"))+1,
            "toRow" : parseInt(selectedTr.last().find("td.selected-fieldgroup").attr("data-rows"))+1};
        $scope.$emit('updateFieldGroupInfo', tabInformation);
    };

    /**
     * update field group name
     * @param groupName
     */
    $scope.updateGroupName = function (groupName) {
        if(fieldGroupNumber) {
            var selectedTr = angular.element('*[data-fielgroup-id='+fieldGroupNumber+']');
            selectedTr.last().find("td.selected-fieldgroup:last").find("div").attr("data-label", groupName)
        }
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

            scope.$on('droppedFieldGroup', function(event, destination) {
                if(!destination.hasClass("selected")) {
                    alert("Please select table first.")
                    return false;
                }
                if(destination.hasClass("selected-fieldgroup")) {
                    alert("Field Group already selected");
                    return false;
                }
                angular.element('td').removeClass('selected-fieldgroup-active');
                var fieldGroupNumber = parseInt(angular.element(el).find(".fieldGroupMark").length)+1;
                var closestTr = destination.closest("tr");
                closestTr.attr("data-fielgroup-id", fieldGroupNumber);
                closestTr.closest("tr").attr("data-fielgroup-id", fieldGroupNumber);
                closestTr.find("td.selected").addClass("selected-fieldgroup selected-fieldgroup-active");

                var userFieldGroupName = prompt("Please enter Field Group name.");
                userFieldGroupName = (userFieldGroupName == null) ? "FieldGroup "+fieldGroupNumber : userFieldGroupName;
                closestTr.find("td.selected:last").addClass("fieldGroupMark");
                closestTr.find("td.selected:last").find("div").attr("data-label",userFieldGroupName);
                scope.showFieldGroupInfo(fieldGroupNumber);
            });
        },
    }
}]);