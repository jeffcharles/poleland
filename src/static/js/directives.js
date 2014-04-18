/* global angular */
angular.module('poleland.directives', []).
    directive('polelandConfirm', ['$modal', function($modal) {
        return {
            scope: {
                method: '&polelandConfirm'
            },
            link: function(scope, element) {
                element.on('click', function() {
                    $modal.open({
                        templateUrl: 'partials/confirm.html',
                        controller: 'Confirm'
                    }).result.then(function() {
                        scope.method();
                    });
                });
            }
        };
    }]).
    directive('polelandAdd', ['uuid4', function(uuid4) {
        return {
            restrict: 'E',
            templateUrl: 'partials/add.html',
            scope: {
                addTo: '&',
                text: '@'
            },
            link: function(scope) {
                scope.showAddArea = false;
                scope.add = function() {
                    scope.itemToAdd = '';
                    scope.showAddArea = true;
                };
                scope.cancel = function() {
                    scope.showAddArea = false;
                };
                scope.done = function() {
                    scope.showAddArea = false;
                    scope.addTo().push({
                        id: uuid4.generate(),
                        content: scope.itemToAdd
                    });
                };
            }
        };
    }]);
