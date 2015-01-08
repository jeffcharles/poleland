/* globals module, require */
'use strict';

var reflux = require('reflux');
var uuid = require('node-uuid');
var actions = require('./../actions');

module.exports = reflux.createStore({
    init: function() {
        this.questions = {};
    },
    listenables: actions,
    onAnswerAddStart: function(questionId) {
        this.questions[questionId].addAnswer = '';
        this.questions[questionId].answerBeingAdded = true;
        this.trigger(this);
    },
    onAnswerAddCanceled: function(questionId) {
        this.questions[questionId].answerBeingAdded = false;
        this.trigger(this);
    },
    onAnswerAddChanged: function(questionId, answer) {
        this.questions[questionId].addAnswer = answer;
        this.questions[questionId].canBeDone = answer.length > 0;
        this.trigger(this);
    },
    onAnswerAddDone: function(questionId) {
        this.questions[questionId].answerBeingAdded = false;
        this.trigger(this);
    },
    onPollLoaded: function(poll) {
        poll.questions.forEach(function(question) {
            this.questions[question.id] = {};
        }, this);
    },
    onQuestionAddStarted: function() {
        this.addQuestion = '';
        this.questionBeingAdded = true;
        this.newQuestionId = uuid.v4();
        this.trigger(this);
    },
    onQuestionAddCanceled: function() {
        this.questionBeingAdded = false;
        this.trigger(this);
    },
    onQuestionAddChanged: function(question) {
        this.addQuestion = question;
        this.canBeDone = question.length > 0;
        this.trigger(this);
    },
    onQuestionAddDone: function() {
        this.questionBeingAdded = false;
        this.questions[this.newQuestionId] = {};
        this.trigger(this);
    },
    onQuestionEdited: function(questionId) {
        this.questions[questionId].beingEdited = true;
        this.trigger(this);
    },
    onQuestionEditingDone: function(questionId) {
        this.questions[questionId].beingEdited = false;
        this.trigger(this);
    },
    onTitleChangeDone: function() {
        this.titleBeingEdited = false;
        this.trigger(this);
    },
    onTitleChangeStarted: function() {
        this.titleBeingEdited = true;
        this.trigger(this);
    }
});
