/* global angular */
angular.module('poleland', [
    'ngRoute',
    'poleland.services',
    'poleland.controllers'
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
