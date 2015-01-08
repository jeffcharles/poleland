/* global document, module, require */
'use strict';

var React = require('react');
var pollListActions = require('./../components/poll-list.js');
var pollList = require('./../components/poll-list.jsx');

module.exports = function() {
    pollListActions.loadPolls();
    React.render(
        React.createElement(pollList),
        document.getElementById('page')
    );
};
