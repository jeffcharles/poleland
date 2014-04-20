/* global _, angular */
angular.module('poleland.controllers', []).
    controller('Confirm',
               ['$scope', '$modalInstance', function($scope, $modalInstance) {
                   'use strict';
                   $scope.yes = function() {
                       $modalInstance.close();
                   };
                   $scope.no = function() {
                       $modalInstance.dismiss();
                   };
               }]).
    controller('ListPolls',
               ['$scope', '$log', 'polls',
                function($scope, $log, polls) {
                    'use strict';
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
                    'use strict';
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

                    $scope.deleteAnswer = function(questionId, answerId) {
                        var q = _.find($scope.poll.questions,
                                        function(question) {
                                            return question.id === questionId;
                                        });
                        _.remove(q.answers, function(answer) {
                            return answer.id === answerId;
                        });
                    };

                    $scope.save = function() {
                        polls.savePoll($routeParams.pollHref, $scope.poll).
                            then(function() {
                                $location.path('#/polls');
                            }, function(err) {
                                $log.error(err);
                            });
                    };

                    $scope.apply = function() {
                        polls.savePoll($routeParams.pollHref, $scope.poll);
                    };

                    $scope.back = function() {
                        $location.path('#/polls');
                    };
                }]);
