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
               ['$scope', '$location', '$log', 'polls', '$routeParams', '_',
                function($scope, $location, $log, polls, $routeParams, _) {
                    'use strict';
                    polls.getPoll($routeParams.pollHref).
                        then(function(poll) {
                            $scope.poll = poll;
                        }, function(err) {
                            $log.error(err);
                        });

                    $scope.sortableOptions = {
                        cancel: 'button:not(.move)',
                        cursor: 'move',
                        handle: 'button.move'
                    };

                    function getQuestionIndexFromId(questionId) {
                        return _.findIndex($scope.poll.questions,
                                           { 'id': questionId });
                    }

                    function getQuestionFromId(questionId) {
                        return _.find($scope.poll.questions,
                                      { 'id': questionId });
                    }

                    $scope.canMoveQuestionUp = function(questionId) {
                        var questionIndex = getQuestionIndexFromId(questionId);
                        return questionIndex > 0;
                    };

                    $scope.canMoveQuestionDown = function(questionId) {
                        var questionIndex = getQuestionIndexFromId(questionId);
                        return questionIndex < $scope.poll.questions.length - 1;
                    };

                    function moveQuestion(questionId, amount) {
                        var questions = $scope.poll.questions;
                        var questionIndex = getQuestionIndexFromId(questionId);
                        var priorQuestion = questions[questionIndex + amount];
                        questions[questionIndex + amount] =
                            questions[questionIndex];
                        questions[questionIndex] = priorQuestion;
                        $scope.poll.questions = questions;
                    }

                    $scope.moveQuestionUp = function(questionId) {
                        moveQuestion(questionId, -1);
                    };

                    $scope.moveQuestionDown = function(questionId) {
                        moveQuestion(questionId, 1);
                    };

                    $scope.deletePoll = function() {
                        polls.deletePoll($routeParams.pollHref).
                            then(function() {
                                $location.path('#/polls');
                            }, function(err) {
                                $log.error(err);
                            });
                    };

                    $scope.deleteQuestion = function(questionId) {
                        _.remove($scope.poll.questions, { 'id': questionId });
                    };

                    $scope.canMoveAnswerUp = function(questionId, answerId) {
                        var question = getQuestionFromId(questionId);
                        var answerIndex =
                                _.findIndex(question.answers,
                                            { 'id': answerId });
                        return answerIndex > 0;
                    };

                    $scope.canMoveAnswerDown = function(questionId, answerId) {
                        var question = getQuestionFromId(questionId);
                        var answerIndex =
                                _.findIndex(question.answers,
                                            { 'id': answerId });
                        return answerIndex < question.answers.length - 1;
                    };

                    function moveAnswer(amount, questionId, answerId) {
                        var questionIndex = getQuestionIndexFromId(questionId);
                        var answers =
                                $scope.poll.questions[questionIndex].answers;
                        var answerIndex =
                                _.findIndex(answers, { 'id': answerId });
                        var priorAnswer = answers[answerIndex + amount];
                        answers[answerIndex + amount] = answers[answerIndex];
                        answers[answerIndex] = priorAnswer;
                        $scope.poll.questions[questionIndex].answers = answers;
                    }

                    $scope.moveAnswerUp = function(questionId, answerId) {
                        moveAnswer(-1, questionId, answerId);
                    };

                    $scope.moveAnswerDown = function(questionId, answerId) {
                        moveAnswer(1, questionId, answerId);
                    };

                    $scope.deleteAnswer = function(questionId, answerId) {
                        var q = getQuestionFromId(questionId);
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
