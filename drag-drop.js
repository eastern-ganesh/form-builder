var module = angular.module("lvl.directives.dragdrop", ['lvl.services','toaster', 'ngAnimate']);
module.value('dropEvent', {dropEl:null, dragEl:null});
module.directive('lvlDraggable', ['$rootScope','toaster', function($rootScope, toaster) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs, controller) {
            angular.element(el).attr("draggable", "true");
            var id = angular.element(el).attr("id");

            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            } 

            el.bind("dragstart", function(eventObject) {
                eventObject.originalEvent.dataTransfer.setData("text", attrs.id);
                $rootScope.$emit("LVL-DRAG-START");
            });

            el.bind("dragend", function(e) {
                $rootScope.$emit("LVL-DRAG-END");
            });
        }
    }
}]);

module.directive('lvlDropTarget', ['$rootScope','uuid','dropEvent', function($rootScope, uuid, dropEvent) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function(scope, el, attrs, controller) {
            var id = angular.element(el).attr("id");

            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            }

            el.bind("dragover", function(eventObject) {
                eventObject.preventDefault();
            });

            el.bind("dragover", function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
                return false;
            });

            el.bind("dragenter", function(e) {
                var dragElement = angular.element(e.target);
                dragElement.addClass('lvl-over');
            });

            el.bind("dragleave", function(e) {
                var dragElement = angular.element(e.target);
                dragElement.removeClass('lvl-over');
            });

            el.bind("drop", function(eventObject) {
                if (eventObject.preventDefault) {
                    eventObject.preventDefault(); // Necessary. Allows us to drop.
                }
                if (eventObject.stopPropogation) {
                    eventObject.stopPropogation(); // Necessary. Allows us to drop.
                }
                var data = eventObject.originalEvent.dataTransfer.getData("text");
                var dest = document.getElementById(id);
                var src = document.getElementById(data);


                scope.onDrop({dragEl: data,dropEl:id})

                eventObject.preventDefault();
            });


            $rootScope.$on("LVL-DRAG-START", function() {
                var el = document.getElementById(id);
            });

            $rootScope.$on("LVL-DRAG-END", function() {
                var el = document.getElementById(id);
                angular.element(el).removeClass("lvl-over");
            });
        }
    }
}]);
