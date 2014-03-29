/* global angular */
angular.module('poleland.controllers', []).
    controller('ListPolls', ['$scope', 'polls', function($scope, polls) {
        $scope.message = 'Loading...';
        $scope.polls = [];
        polls.getPolls().
            then(function(polls) {
                $scope.message = '';
                $scope.polls = polls;
            }, function(err) {
                switch(err) {
                case 'ApiServerDown':
                    $scope.message = 'API server down';
                    break;
                default:
                    $scope.message = err;
                }
            });
    }]).
    controller('Poll',
               ['$scope', 'polls', '$routeParams',
                function($scope, polls, $routeParams) {
                    polls.getPoll($routeParams.pollHref).
                        then(function(poll) {
                            $scope.poll = poll;
                        });
                }]);
