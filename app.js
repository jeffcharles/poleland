var express = require('express');
var routes = require('./routes');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(app.router);

if(app.get('env') == 'development') {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
