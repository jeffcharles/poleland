/* global console, module, process, require */
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

app.get('/', routes.index);
app.get('/polls', polls.index);
app.get('/polls/:pollId', polls.get);
app.put('/polls/:pollId', polls.put);
app.del('/polls/:pollId', polls.del);

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));

module.exports = app;