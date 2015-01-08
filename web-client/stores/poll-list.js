/* global module, require */
'use strict';

var reflux = require('reflux');
var actions = require('./../actions');

module.exports = reflux.createStore({
    listenables: actions,
    onPollsLoaded: function(pollsEnvelope) {
        this.polls = pollsEnvelope.polls;
        this._pollsLoaded(pollsEnvelope);
    },
    onPollsMoreLoaded: function(pollsEnvelope) {
        this.polls = this.polls.concat(pollsEnvelope.polls);
        this._pollsLoaded(pollsEnvelope);
    },
    _pollsLoaded: function(pollsEnvelope) {
        this.loadMoreHref = pollsEnvelope._links && pollsEnvelope._links.next;
        this.trigger({
            polls: this.polls,
            canLoadMore: this.loadMoreHref
        });
    }
});
