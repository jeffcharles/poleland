/* global __dirname, module, process, require */
'use strict';

var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var express = require('express');
var logger = require('morgan');
var routes = require('./routes');
var polls = require('./routes/polls');
var submissions = require('./routes/poll-submissions');

var app = express();

app.set('port', process.env.PORT || 80);
app.use(logger('dev'));

if(app.get('env') == 'development') {
    app.use(errorHandler());
}

app.use(express.static(__dirname + '/../dist'));

var apiRouter = new express.Router();
apiRouter.use(bodyParser.json());
apiRouter.get('/', routes.index);
apiRouter.get('/polls', polls.index);
apiRouter.post('/polls', polls.post);
apiRouter.get('/polls/:pollId', polls.get);
apiRouter.put('/polls/:pollId', polls.put);
apiRouter.delete('/polls/:pollId', polls.del);
apiRouter.post('/polls/:pollId/submissions', submissions.post);

var baseApiRouter = new express.Router();
baseApiRouter.use('/v1', apiRouter);
baseApiRouter.use(function(req, res) {
    res.sendStatus(404);
});

app.use('/api', baseApiRouter);

app.use(function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/../dist/' });
});

module.exports = app;
