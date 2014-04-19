/* global module, process, require */
var express = require('express');
var routes = require('./routes');
var polls = require('./routes/polls');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(app.router);

if(app.get('env') == 'development') {
    app.use(express.errorHandler());
}

app.get('/api/v1', routes.index);
app.get('/api/v1/polls', polls.index);
app.post('/api/v1/polls', polls.post);
app.get('/api/v1/polls/:pollId', polls.get);
app.put('/api/v1/polls/:pollId', polls.put);
app.del('/api/v1/polls/:pollId', polls.del);

module.exports = app;
