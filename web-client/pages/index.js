/* global require, module */
'use strict';
var page = require('page');
var url = require('url');
var poll = require('./poll');
var pollList = require('./poll-list');
var redirect = require('./redirect');

page('/', pollList);
page('/polls/create', poll.create);
page('/polls/:pollId', poll.view);

redirect.on(function(href) {
    var parsedUrl = url.parse(href);
    page(parsedUrl.path);
});

module.exports = page;
