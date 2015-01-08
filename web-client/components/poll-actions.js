/* global module, require */
'use strict';

var actions = require('./../actions');

module.exports.addQuestion = function() {
    actions.questionAddStarted();
};

module.exports.cancelAddingQuestion = function() {
    actions.questionAddCanceled();
};

module.exports.changeAddQuestion = function(e) {
    actions.questionAddChanged(e.target.value);
};

module.exports.changeTitle = function(e) {
    actions.titleChanged(e.target.value);
};

module.exports.doneAddingQuestion = function() {
    actions.questionAddDone();
};

module.exports.doneChangeTitle = function(e) {
    if(!e.key || e.key === 'Enter') {
        actions.titleChangeDone();
    }
};

module.exports.questionFuncs = function(questionId) {
    return {
        cancelAddingAnswer: function() {
            actions.answerAddCanceled(questionId);
        },
        changeAddAnswer: function(e) {
            actions.answerAddChanged(questionId, e.target.value);
        },
        deleteAnswer: function(answerId) {
            actions.answerDeleted(questionId, answerId);
        },
        deleteQuestion: function() {
            actions.questionDeleted(questionId);
        },
        doneAddingAnswer: function() {
            actions.answerAddDone(questionId);
        },
        doneEditingQuestion: function() {
            actions.questionEditingDone(questionId);
        },
        editQuestion: function() {
            actions.questionEdited(questionId);
        },
        moveAnswerDown: function(answerId) {
            actions.answerMovedDown(questionId, answerId);
        },
        moveAnswerUp: function(answerId) {
            actions.answerMovedUp(questionId, answerId);
        },
        startAddAnswer: function() {
            actions.answerAddStart(questionId);
        }
    };
};

module.exports.startChangeTitle = function() {
    actions.titleChangeStarted();
};
