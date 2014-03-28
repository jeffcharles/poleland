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
            $scope.polls = data;
        }).error(function(data, status) {
            $scope.message = 'API returned status ' + status;
        });
    }]);
