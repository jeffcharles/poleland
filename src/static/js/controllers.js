/* global angular */
angular.module('poleland.controllers', []).
    controller('ListPolls', ['$scope', '$http', function($scope, $http) {
        $scope.message = 'Loading...';
        $scope.polls = [];
        $http({
            method: 'GET',
            url: '/api/v1/polls'
        }).success(function(data) {
            $scope.message = '';
            $scope.polls = data.map(function(poll) {
                return {
                    title: poll.title,
                    href: encodeURIComponent(encodeURIComponent(
                        poll._links.self.href))
                };
            });
        }).error(function(data, status) {
            $scope.message = 'API returned status ' + status;
        });
    }]).
    controller('Poll',
               ['$scope', '$http', '$routeParams',
                function($scope, $http, $routeParams) {
                    $http({
                        method: 'GET',
                        url: decodeURIComponent($routeParams.pollHref)
                    }).success(function(data) {
                        $scope.poll = data;
                    });
                }]);
