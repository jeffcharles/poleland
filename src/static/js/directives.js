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
    }]);
