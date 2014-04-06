/* global _, angular */
angular.module('poleland.controllers', []).
    controller('ListPolls',
               ['$scope', '$log', 'polls',
                function($scope, $log, polls) {
                    $scope.polls = [];
                    polls.getPolls().
                        then(function(polls) {
                            $scope.polls = polls;
                        }, function(err) {
                            $log.error(err);
                        });

                    $scope.deletePoll = function(pollHref) {
                        polls.deletePoll(decodeURIComponent(pollHref)).
                            then(function() {
                                _.remove($scope.polls, function(poll) {
                                    return poll.href === pollHref;
                                });
                            }, function(err) {
                                $log.error(err);
                            });
                    };
                }]).
    controller('Poll',
               ['$scope', '$location', '$log', 'polls', '$routeParams',
                function($scope, $location, $log, polls, $routeParams) {
                    polls.getPoll($routeParams.pollHref).
                        then(function(poll) {
                            $scope.poll = poll;
                        }, function(err) {
                            $log.error(err);
                        });

                    $scope.deletePoll = function() {
                        polls.deletePoll($routeParams.pollHref).
                            then(function() {
                                $location.path('#/polls');
                            }, function(err) {
                                $log.error(err);
                            });
                    };
                }]);
