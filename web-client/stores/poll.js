/* global module, require */
'use strict';

var _ = require('lodash');
var reflux = require('reflux');
var uuid = require('node-uuid');
var actions = require('./../actions');
var pollEdit = require('./poll-edit');

module.exports = reflux.createStore({
    listenables: actions,
    answerMoved: function(questionId, answerId, amount) {
        this.poll.questions = this.poll.questions.map(function(question) {
            if(question.id !== questionId) {
                return question;
            }
            var answerIndex = _.findIndex(question.answers, { id: answerId });
            var priorAnswer = question.answers[answerIndex + amount];
            question.answers[answerIndex + amount] =
                question.answers[answerIndex];
            question.answers[answerIndex] = priorAnswer;
            return question;
        });
        this.trigger(this.poll);
    },
    onAnswerAddDone: function(questionId) {
        this.poll.questions = this.poll.questions.map(function(question) {
            if(question.id !== questionId) {
                return question;
            }
            question.answers.push({
                id: uuid.v4(),
                content: pollEdit.questions[questionId].addAnswer
            });
            return question;
        });
        this.trigger(this.poll);
    },
    onAnswerDeleted: function(questionId, answerId) {
        this.poll.questions = this.poll.questions.map(function(question) {
            if(question.id !== questionId) {
                return question;
            }
            question.answers = _.filter(question.answers, function(answer) {
                return answer.id !== answerId;
            });
            return question;
        });
        this.trigger(this.poll);
    },
    onAnswerMovedDown: function(questionId, answerId) {
        this.answerMoved(questionId, answerId, 1);
    },
    onAnswerMovedUp: function(questionId, answerId) {
        this.answerMoved(questionId, answerId, -1);
    },
    onPollCreateStarted: function() {
        this.poll = { title: '', questions: [] };
    },
    onQuestionAddDone: function() {
        this.poll.questions.push({
            id: pollEdit.newQuestionId,
            content: pollEdit.addQuestion,
            answers: []
        });
        this.trigger(this.poll);
    },
    onPollLoaded: function(poll) {
        this.poll = poll;
        this.trigger(this.poll);
    },
    onQuestionDeleted: function(questionId) {
        this.poll.questions = _.filter(this.poll.questions, function(question) {
            return question.id !== questionId;
        });
        this.trigger(this.poll);
    },
    onTitleChanged: function(title) {
        this.poll.title = title;
        this.trigger(this.poll);
    }
});
