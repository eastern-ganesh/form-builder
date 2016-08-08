var module = angular.module("form.builder", []);

var formBuilderController = function($scope, $compile) {
    $scope.table;
    $scope.isMouseDown;
    $scope.firstClickedTr;
    $scope.lastClickedTr;
    $scope.firstClieckedTd;
    $scope.lastClickedTd;

    
    /**
     * call when mouse down.
     * @param  {currentId}
     * @return {bool}
     */
    $scope.startDrawing = function(currentTd) {
        var currentTd = currentTd.parents("td");
        if(currentTd.hasClass("lastClass")) {
            $scope.isMouseDown = true;
            currentTd.addClass("selected recent");
        }
        if($scope.table.find('td').hasClass("marker") && currentTd.hasClass("selected")) {}
        else {
            currentTd.addClass("marker"); 
        }

        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happened on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawing = function(element) {
        var currentTd = angular.element(element).parents("td");
        if ($scope.isMouseDown && currentTd.hasClass("selectable")) {

            if (!currentTd.hasClass('recent')) {
                currentTd.addClass("selected recent");
            } else {
                angular.element(".recent").removeClass('recent');
            }

            //get the cell where first click
            var firstClickedCell = $scope.table.find('td.marker')[0];
            $scope.firstClickedTr = $.inArray($(firstClickedCell).parent()[0], $scope.table.find('tr'));
            $scope.lastClickedTr = $.inArray(currentTd.parent()[0], $scope.table.find('tr'));
            $scope.firstClieckedTd = $.inArray(firstClickedCell, $(firstClickedCell).parent().find('td'));
            $scope.lastClickedTd = $.inArray(currentTd.get(0), currentTd.parent().find('td'));

            // If end tr is greater the start tr then swap value
            if ($scope.firstClickedTr > $scope.lastClickedTr) {
                var temp = $scope.lastClickedTr;
                $scope.lastClickedTr = $scope.firstClickedTr;
                $scope.firstClickedTr = temp;
            }
            // If end td is greater the start td then swap value
            if ($scope.firstClieckedTd > $scope.lastClickedTd) {
                var temp = $scope.lastClickedTd;
                $scope.lastClickedTd = $scope.firstClieckedTd;
                $scope.firstClieckedTd = temp;
            }
            $scope.showSelected();
        }
    };

    /**
     * Show selected class in table.
     * @return {void}
     */
    $scope.showSelected = function() {
        var rowNumber = 0;
        var columnNumber = 0;
        for (y = $scope.firstClickedTr; y <= $scope.lastClickedTr; y++) {
            for (x = $scope.firstClieckedTd; x <= $scope.lastClickedTd; x++) {
                $scope.table.find('tr:eq(' + y + ')').find('td:eq(' + x + ')').each(function(i, o) {
                    var th = $(this);
                    if (th.hasClass('selectable')) {
                        if (th.hasClass('recent')) {}
                        else {
                            th.closest("tr").addClass("selected-list");
                            th.addClass("selected").addClass('recent');
                            var tabNumber = th.closest("tr").attr("data-tab-number");
                            if(tabNumber) {
                                th.closest("tr > td").addClass("selected_tab")
                            }
                        }
                        th.attr('data-cols', columnNumber);
                        th.attr('data-rows', rowNumber);
                    }
                });
                columnNumber++;
            }
            rowNumber++;
            columnNumber = 0;
        }
    }

    /**
     * stop when mouse over end
     * @param  {element}
     * @return {void}
     */
    $scope.endDrawingTable = function() {
        $scope.isMouseDown = false;
        angular.element('td.selectable').removeClass('recent');
        angular.element('td.selected').removeClass('lastClass');
        angular.element('.selected').last().addClass("lastClass");
        var lastElement = angular.element(".selected").last();
        $scope.formInfo.rows = parseInt(lastElement.attr("data-rows"))+1;
        $scope.formInfo.cols = parseInt(lastElement.attr("data-rows"))+1;

        angular.element("#tableRowCount").html(parseInt(lastElement.attr("data-rows"))+1);
        angular.element("#tableColsCount").html(parseInt(lastElement.attr("data-cols"))+1);

        $scope.resetTable();
    }

    /**
     * Reset table structure when it is resize
     */
    $scope.resetTable = function () {
        $scope.table.find("[data-tab-id]").each(function () {
            $(this).find("td.selected").addClass("selected_tab");
        });

        $scope.table.find("[data-fielgroup-id]").each(function () {
            var label = $(this).find("td.fieldGroupMark").find("div").attr("data-label");
            if(label) {
                $(this).find("td.fieldGroupMark").find("div").removeAttr("data-label");
                $(this).find("td.fieldGroupMark").removeClass("fieldGroupMark");
                $(this).find("td.selected:last").addClass("fieldGroupMark");
                $(this).find("td.selected:last").find("div").attr("data-label", label);
            }
            $(this).find("td.selected").addClass("selected-fieldgroup");
        });
    }

    /**
     * create element of new tr
     * @param lastTd
     * @returns {Object}
     */
    $scope.createNewTr = function (lastTd) {
        var numberOfTd = parseInt(lastTd.closest("tr").find("td").length);
        var trString = "<tr>";
        for(var i = 1 ; i <=numberOfTd; i++ ) {
            var td = "<td x-lvl-drop-target='true' x-on-drop='dropped(dragEl, dropEl)' class='selectable'><div></div></td>";
            trString = trString + td;
        }

        var tr = angular.element(trString);
        $scope.table.append(tr);
        $compile(tr)($scope);
        $(".maxHeight").scrollTop($scope.table.height());
    }
};


module.directive('formBuilder', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            replace : true,
            scope : false,
            controller: formBuilderController,
            link: function(scope, el, attrs, controller) {
                scope.table = angular.element(el);

                el.on("mousedown","td.selectable",function(e){
                    return scope.startDrawing(angular.element(e.target));
                });

                el.on("mouseover","td.selectable",function(e) {
                    var currentTd = angular.element(e.target).parents('td');
                    if(scope.isMouseDown && currentTd.closest("tr").is(":last-child")) {
                        scope.createNewTr(currentTd);
                    }

                    scope.drawing(e.target);
                });

                $(document).on('mouseup', function(){
                    scope.endDrawingTable();
                });

                el.on("selectstart","td.selectable",function(e){
                    return false;
                });

                scope.$on('droppedTable', function(event, args) {
                    angular.element("#"+args.dest).addClass("selected marker lastClass");
                    angular.element("#tableRowCount").html(1);
                    angular.element("#tableColsCount").html(1);
                });
            },
        }
    }]);
