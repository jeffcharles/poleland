/* global module, require */
'use strict';

var $ = require('jquery');
var actions = require('./../actions');
var apiIndex = require('./../api-index');
var pollListStore = require('./../stores/poll-list');
var redirect = require('./../pages/redirect');
var status = require('./../status');

module.exports.createPoll = function() {
    redirect.toHref('/polls/create');
};

module.exports.loadMorePolls = function() {
    var clearStatus = status.setInfo('Loading polls...');
    $.get(pollListStore.loadMoreHref)
        .then(function(polls) {
            clearStatus();
            actions.pollsMoreLoaded(polls);
        }).then(null, function() {
            status.flashDanger('Failed to load more polls');
        });
};

module.exports.loadPolls = function() {
    var clearStatus = status.setInfo('Loading polls...');
    return apiIndex.then(function(rels) {
        return $.get(rels.polls.href);
    }).then(function(polls) {
        clearStatus();
        actions.pollsLoaded(polls);
    }).then(null, function() {
        status.flashDanger('Failed to load polls');
    });
};
