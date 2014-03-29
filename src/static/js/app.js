/* global angular */
angular.module('poleland', [
    'ngRoute',
    'poleland.controllers'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/polls', {
            templateUrl: 'partials/polls.html',
            controller: 'ListPolls'
        });
        $routeProvider.otherwise({redirectTo: '/polls'});
    }]);
