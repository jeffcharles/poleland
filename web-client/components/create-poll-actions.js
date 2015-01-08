/* global history, module, require */
'use strict';

var $ = require('jquery');
var actions = require('./../actions');
var apiIndex = require('./../api-index');
var pollStore = require('./../stores/poll');
var redirect = require('./../pages/redirect');
var status = require('./../status');

function createPoll(redirectFn) {
    var clearStatus = status.setInfo('Creating poll...');
    apiIndex.then(function(rels) {
        return $.ajax({
            url: rels.polls.href,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(pollStore.poll),
            processData: false
        });
    }).then(function(data) {
        clearStatus();
        var href = redirectFn(data);
        redirect.toHref(href);
    }).then(null, function() {
        status.flashDanger('Failed to create poll');
    });
}

module.exports.apply = function() {
    createPoll(function(data) {
        return '/polls/' + data.id;
    });
};

module.exports.cancel = function() {
    history.back();
};

module.exports.init = function() {
    actions.pollCreateStarted();
};

module.exports.save = function() {
    createPoll(function() {
        return '/';
    });
};
