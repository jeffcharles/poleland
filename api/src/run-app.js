/* global console, process, require */
'use strict';

var appContainer = require('./app');

appContainer.start();
process.on('exit', appContainer.stop);
var app = appContainer.app;
app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
