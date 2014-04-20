/* global angular */
angular.module('poleland', [
    'ngRoute',
    'ui.bootstrap',
    'uuid4',
    'poleland.services',
    'poleland.controllers',
    'poleland.directives'
]).
    config(['$routeProvider', function($routeProvider) {
        'use strict';
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
