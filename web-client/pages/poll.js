/* global document, module, require */
'use strict';

var React = require('react');
var createPoll = require('./../components/create-poll.jsx');
var createPollActions = require('./../components/create-poll-actions');
var viewPoll = require('./../components/view-poll.jsx');
var viewPollActions = require('./../components/view-poll-actions');

module.exports.create = function() {
    createPollActions.init();
    React.render(
        React.createElement(createPoll),
        document.getElementById('page')
    );
};

module.exports.view = function(ctx) {
    viewPollActions.loadPoll(ctx);
    React.render(
        React.createElement(viewPoll),
        document.getElementById('page')
    );
};
