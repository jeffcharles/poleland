/* global console, require */
var app = require('./app');

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
