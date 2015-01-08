'use strict';

var React = require('react');
var reflux = require('reflux');
var pollActions = require('./poll-actions');
var pollStore = require('./../stores/poll');
var pollEditStore = require('./../stores/poll-edit');

var Question = React.createClass({
    componentWillMount: function() {
        this.actions = pollActions.questionFuncs(this.props.question.id);
    },
    componentWillReceiveProps: function() {
        this.actions = pollActions.questionFuncs(this.props.question.id);
    },
    render: function() {
        var addAnswer;
        var addAnswerItem;
        if(this.props.editState.beingEdited && !this.props.editState.answerBeingAdded) {
            addAnswer = (
              <button className="btn btn-default btn-sm add-answer"
                      onClick={this.actions.startAddAnswer}>
                <span className="glyphicon glyphicon-plus" /> Add answer
              </button>
            );
        } else if(this.props.editState.beingEdited && this.props.editState.answerBeingAdded) {
            addAnswerItem = (
              <li>
                <textarea className="form-control"
                          value={this.props.editState.addAnswer}
                          onChange={this.actions.changeAddAnswer} />
                <ul className="list-inline">
                  <li>
                    <button className="btn btn-success btn-xs"
                            disabled={!this.props.editState.canBeDone}
                            onClick={this.actions.doneAddingAnswer}>
                      <span className="glyphicon glyphicon-ok" /> Done
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-warning btn-xs"
                            onClick={this.actions.cancelAddingAnswer}>
                      <span className="glyphicon glyphicon-warning-sign" /> Cancel
                    </button>
                  </li>
                </ul>
              </li>
            );
        }
        return (
          <li className="poll-question">
            <ul className="pull-right action-list">
              <li>
                {this.props.editState.beingEdited ? (
                    <button type="button"
                            className="btn btn-default"
                            onClick={this.actions.doneEditingQuestion}>
                      <span className="glyphicon glyphicon-ok" /> Done
                    </button>
                ) : (
                    <button type="button"
                            className="btn btn-default"
                            onClick={this.actions.editQuestion}>
                      <span className="glyphicon glyphicon-edit" /> Edit
                    </button>
                )}
              </li>
              <li>
                <button type="button" className="btn btn-danger"
                        onClick={this.actions.deleteQuestion}>
                  <span className="glyphicon glyphicon-remove" /> Delete
                </button>
              </li>
            </ul>
            <div>
              {this.props.question.content}
              <ol className="poll-answers">
                {this.props.question.answers.map(function(answer, index, array) {
                    var editingPieces;
                    if(this.props.editState.beingEdited) {
                        editingPieces = (
                          <ul className="list-inline">
                            <li>
                              <button className="btn btn-default btn-xs"
                                      disabled={index === 0}
                                      onClick={this.actions.moveAnswerUp.bind(undefined, answer.id)}>
                                <span className="glyphicon glyphicon-arrow-up" /> Move up
                              </button>
                              <button className="btn btn-default btn-xs"
                                      disabled={index === array.length - 1}
                                      onClick={this.actions.moveAnswerDown.bind(undefined, answer.id)}>
                                  <span className="glyphicon glyphicon-arrow-down" /> Move down
                              </button>
                              <button className="btn btn-danger btn-xs"
                                      onClick={this.actions.deleteAnswer.bind(undefined, answer.id)}>
                                <span className="glyphicon glyphicon-remove" /> Delete
                              </button>
                            </li>
                          </ul>
                        );
                    }
                    return (
                      <li key={answer.id}>
                        {answer.content}
                        {editingPieces}
                      </li>
                    );
                }, this)}
                {addAnswerItem}
              </ol>
              {addAnswer}
            </div>
          </li>
        );
    }
});

module.exports = React.createClass({
    mixins: [
        reflux.connect(pollStore, 'poll'),
        reflux.connect(pollEditStore, 'pollEdit')
    ],
    getInitialState: function() {
        return {
            poll: { questions: [] },
            pollEdit: { questions: {} }
        };
    },
    startChangeTitle: function(e) {
        e.preventDefault();
        pollActions.startChangeTitle();
    },
    render: function() {
        var addQuestion;
        var addQuestionItem;
        if(this.state.pollEdit.questionBeingAdded) {
            addQuestionItem = (
              <li>
                <textarea className="form-control"
                          value={this.state.pollEdit.addQuestion}
                          onChange={pollActions.changeAddQuestion} />
                <ul className="list-inline">
                  <li>
                    <button className="btn btn-success btn-xs"
                            disabled={!this.state.pollEdit.canBeDone}
                            onClick={pollActions.doneAddingQuestion}>
                      <span className="glyphicon glyphicon-ok" /> Done
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-warning btn-xs"
                            onClick={pollActions.cancelAddingQuestion}>
                      <span className="glyphicon glyphicon-warning-sign" /> Cancel
                    </button>
                  </li>
                </ul>
              </li>
            );
        } else {
            addQuestion = (
              <button className="btn btn-default btn-sm"
                      onClick={pollActions.addQuestion}>
                <span className="glyphicon glyphicon-plus" /> Add question
              </button>
            );
        }
        return (
            <div>
              {this.state.pollEdit.titleBeingEdited ? (
                <h1>
                  <input type="text"
                         autoFocus
                         value={this.state.poll.title}
                         onChange={pollActions.changeTitle}
                         onBlur={pollActions.doneChangeTitle}
                         onKeyPress={pollActions.doneChangeTitle} />
                </h1>
              ) : (
                <h1>
                  <a href="javascript:void(0);"
                     onClick={this.startChangeTitle}
                     className="edit-in-place">
                    {this.state.poll.title} <span className="glyphicon glyphicon-pencil" />
                  </a>
                </h1>
              )}
              <ol className="poll-questions">
                {this.state.poll.questions.map(function(question) {
                    return (
                        <Question key={question.id}
                                  question={question}
                                  editState={this.state.pollEdit.questions[question.id] || {}} />
                    );
                }, this)}
                {addQuestionItem}
              </ol>
              {addQuestion}
            </div>
        );
    }
});
