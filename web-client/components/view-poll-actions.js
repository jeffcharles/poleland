/* global module, require */
'use strict';

var $ = require('jquery');
var urlTemplate = require('url-template');
var actions = require('./../actions');
var apiIndex = require('./../api-index');
var pollStore = require('./../stores/poll');
var redirect = require('./../pages/redirect');
var status = require('./../status');

module.exports.apply = function() {
    var clearStatus = status.setInfo('Saving poll...');
    return $.ajax({
        url: pollStore.poll._links.self.href,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(pollStore.poll),
        processData: false
    }).then(function() {
        clearStatus();
        status.flashSuccess('Saved poll');
    }).then(null, function() {
        status.flashDanger('Failed to save poll');
    });
};

module.exports.deletePoll = function() {
    var clearStatus = status.setInfo('Deleting poll...');
    $.ajax({
        url: pollStore.poll._links.self.href,
        type: 'DELETE'
    }).then(function() {
        clearStatus();
        status.flashSuccess('Deleted poll');
        // TODO should probably delete poll from list store here
        // TODO should probably delete poll from poll store here
        redirect.toHref('/');
    }).then(null, function() {
        status.flashDanger('Failed to delete poll');
    });
};

module.exports.loadPoll = function(ctx) {
    var pollId = ctx.params.pollId;
    var clearStatus = status.setInfo('Loading poll...');
    apiIndex
        .then(function(rels) {
            var pollUrl =
                    urlTemplate.parse(rels.poll.href).expand({ id: pollId });
            return $.get(pollUrl);
        }).then(function(poll) {
            clearStatus();
            actions.pollLoaded(poll);
        }).then(null, function() {
            status.flashDanger('Failed to load poll');
        });
};

module.exports.save = function() {
    module.exports.apply().then(function() {
        redirect.toHref('/');
    });
};
