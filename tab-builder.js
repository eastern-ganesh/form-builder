var module = angular.module("tab.builder", []);

var tabBuilderController = function($scope) {
    var isMouseDown;
    var startTabElement = null;
    var tabNumber = 0;

    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawingTab = function(currentTd) {
        startTabElement = currentTd;
        isMouseDown = true;
        tabNumber = currentTd.closest("tr").attr("data-tab-id");
        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawing = function(element) {
        if (isMouseDown) {
            var closestTr = angular.element(element).closest("tr");
            if(!closestTr.attr("data-tab-id")) {
                closestTr.find("td.selected").each(function() {
                    $(this).addClass("selected_tab");
                    $(this).closest("tr").attr("data-tab-id", tabNumber);
                });
            } else {
                console.log("Invalid row selection " + closestTr.attr("id"));
                isMouseDown = false;
                return false;
            }
        }
    };

    $scope.endDrawingTab = function() {
        var tabName = null;
        if(isMouseDown && startTabElement) {
            tabName = startTabElement.attr("data-label");
            startTabElement.removeAttr("data-label");
            startTabElement.parents("td").removeClass("tabMark");
            angular.element('td').removeClass('selected-tab-active');

            var selectedTr = angular.element('*[data-tab-id='+tabNumber+']');
            selectedTr.find("td.selected_tab").addClass("selected-tab-active");
            selectedTr.last().find("td.selected:first").addClass("tabMark");
            selectedTr.last().find("td.selected:first").find("div").attr("data-label", tabName);
            $scope.showTabInfo(null);
        }

        isMouseDown = false;
    }

    /**
     * update tab name
     * @param tabName
     */
    $scope.updateTabName = function (tabName) {
        if(tabNumber) {
            var selectedTr = angular.element('*[data-tab-id='+tabNumber+']');
            selectedTr.last().find("td.selected_tab:first").find("div").attr("data-label", tabName);
        }
    }

    /**
     * Show tab info in table
     */
    $scope.showTabInfo = function(tabNu) {
        tabNumber = (tabNu != null) ? tabNumber : tabNumber;
        var selectedTr = angular.element('*[data-tab-id = '+tabNumber+']');
        var tabInformation = { 'id' : tabNumber,
            'name' : selectedTr.last().find("td.selected_tab:first").find("div").attr("data-label"),
            "fromRow" : parseInt(selectedTr.first().find("td.selected_tab").attr("data-rows"))+1,
            "toRow" : parseInt(selectedTr.last().find("td.selected_tab").attr("data-rows"))+1};
        $scope.$emit('updateTabInfo', tabInformation);
    };
};

module.directive('tabBuilder', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        replace : true,
        scope : {},
        controller: tabBuilderController,
        link: function(scope, el, attrs, controller) {
            el.on("mousedown","td.tabMark",function(e) {
                return scope.startDrawingTab(angular.element(e.target));
            });

            el.on("mouseover","td.selected",function(e){
                scope.drawing(angular.element(e.target));
            });

            $(document).on('mouseup', function(){
                scope.endDrawingTab();
            });

            el.on("selectstart","td.selected",function(e){
                return false;
            });

            scope.$on('droppedTab', function(event, destination) {
                if(!destination.hasClass("selected")) {
                    alert("Please select table first.");
                    return false;
                }
                if(destination.hasClass("selected_tab")) {
                    alert("Tab already selected");
                    return false;
                }

                angular.element('td').removeClass('selected-tab-active');
                var tabNumber = parseInt(angular.element(el).find(".tabMark").length)+1;

                var closestTr = destination.closest("tr");
                closestTr.closest("tr").attr("data-tab-id", tabNumber);
                closestTr.find("td.selected").addClass("selected_tab selected-tab-active");

                var userTabName = prompt("Please enter tab Name.");
                userTabName = (userTabName == null) ? "Tab "+tabNumber : userTabName;
                closestTr.find("td.selected:first").find("div").attr("data-label", userTabName);
                closestTr.find("td.selected:first").addClass("tabMark");
                scope.showTabInfo(tabNumber);
            });

            scope.$on('updateTabName', function (event, args) {
                scope.updateTabName(args.tabName);
            });
        }
    }
}]);
