/* global module, process, require */
'use strict';

var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var express = require('express');
var logger = require('morgan');
var routes = require('./routes');
var polls = require('./routes/polls');
var submissions = require('./routes/poll-submissions');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());

if(app.get('env') == 'development') {
    app.use(errorHandler());
}

app.get('/api/v1', routes.index);
app.get('/api/v1/polls', polls.index);
app.post('/api/v1/polls', polls.post);
app.get('/api/v1/polls/:pollId', polls.get);
app.put('/api/v1/polls/:pollId', polls.put);
app.del('/api/v1/polls/:pollId', polls.del);
app.post('/api/v1/polls/:pollId/submissions', submissions.post);

module.exports = app;
