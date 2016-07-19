var module = angular.module("form.builder", []);

var formBuilderController = function($scope) {
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
        if($scope.table.find('td').hasClass("selected") && !currentTd.hasClass("selected")) {
            return false;
        }

        if(currentTd.hasClass("lastClass")) {
            $scope.isMouseDown = true; 
        }
        currentTd.addClass("selected").addClass('recent');

        if($scope.table.find('td').hasClass("marker") && currentTd.hasClass("selected")) {} 
        else {
            currentTd.addClass("marker"); 
        }

        return false; // prevent text selection
    };

    /**
     * Call when mouse over is happend on td
     * @param  {currentTd}
     * @return {}
     */
    $scope.drawing = function(element) {
        var currentTd = angular.element(element);
        if ($scope.isMouseDown && currentTd.hasClass("selectable")) {


            if (!currentTd.hasClass('recent')) {
                currentTd.addClass("selected").addClass('recent');
            } else {
                angular.element(".recent").removeClass('recent');//.removeClass('selected');
            }

            //get the cell where first click
            var firstClickedCell = $scope.table.find('td.marker')[0];
            $scope.firstClickedTr = $.inArray($(firstClickedCell).parent()[0], $scope.table.find('tr'));
            $scope.lastClickedTr = $.inArray(currentTd.parent()[0], $scope.table.find('tr'));
            $scope.firstClieckedTd = $.inArray(firstClickedCell, $(firstClickedCell).parent().find('td'));
            $scope.lastClickedTd = $.inArray(element, currentTd.parent().find('td'));
            
            
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
                            th.addClass("selected").addClass('recent');
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
     * stop when mouseover end
     * @param  {element}
     * @return {void}
     */
    $scope.endDrawing = function(e) {
        $scope.isMouseDown = false;
        angular.element('td.selectable').removeClass('recent');
        angular.element('td.selected').removeClass('lastClass');
        angular.element('.selected').last().addClass("lastClass");

        var text = $('#table_info');
        text.html("");
        var lastElement = $( ".selected" ).last();
        var numberOfRows = parseInt(lastElement.attr("data-rows"))+1;
        var numberOfCols = parseInt(lastElement.attr("data-cols"))+1;
        text.prepend("number of  Cols:" + numberOfCols +"<br/>"+"number of  Rows:" + numberOfRows);
    }
};


module.directive('formBuilder', ['$rootScope','$compile', function($rootScope, $compile) {
        return {
            restrict: 'E',
            replace : true,
            controller: formBuilderController,
            link: function(scope, el, attrs, controller) {
                scope.table = angular.element(el);
                var self = scope;
                
                el.on("mousedown","td.selectable",function(e){
                    var currentTd = angular.element(e.target);
                    return scope.startDrawing(currentTd);
                });

                el.on("mouseover","td.selectable",function(e){
                    var currentTd = angular.element(e.target);
                    if(scope.isMouseDown && currentTd.closest("tr").is(":last-child")) {
                        var cloneTr = scope.destionation.closest("tr").clone();
                        var numberOfTd = parseInt(currentTd.closest("tr").find("td").length);
                        var trString = "<tr>";
                        for(var i = 1 ; i <=numberOfTd; i++ ) {
                            var td = "<td x-lvl-drop-target='true' x-on-drop='dropped(dragEl, dropEl)' class='selectable'></td>";
                            trString = trString + td;
                        }

                        var tr = angular.element(trString);
                        scope.table.append(tr);
                        $compile(tr)(scope);

                        $(".maxHeight").scrollTop(scope.table.height());
                    }

                    scope.drawing(e.target);

                });


                el.on("mouseup", function(e){
                    scope.endDrawing(e);
                });

                el.on("selectstart","td.selectable",function(e){
                    return false;
                });
            },
            templateUrl: 'form-builder.html'
        }
    }]);
