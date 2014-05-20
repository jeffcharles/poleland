/* global angular */
angular.module('poleland.directives', []).
    directive('polelandConfirm', ['$modal', function($modal) {
        'use strict';
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
    directive('polelandAdd', ['_', 'uuid4', function(_, uuid4) {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'partials/add.html',
            scope: {
                addTo: '&',
                text: '@',
                propsToMerge: '&'
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
                    var element = _.merge({
                        id: uuid4.generate(),
                        content: scope.itemToAdd
                    }, scope.propsToMerge());
                    scope.addTo().push(element);
                };
            }
        };
    }]);
