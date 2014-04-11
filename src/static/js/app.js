/* global angular */
angular.module('poleland', [
    'ngRoute',
    'ui.bootstrap',
    'poleland.services',
    'poleland.controllers',
    'poleland.directives'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/polls', {
            templateUrl: 'partials/polls.html',
            controller: 'ListPolls'
        });
        $routeProvider.when('/polls/:pollHref', {
            templateUrl: 'partials/poll.html',
            controller: 'Poll'
        });
        $routeProvider.otherwise({redirectTo: '/polls'});
    }]);
