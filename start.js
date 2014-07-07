var constants = require('./lib/constants');
var express = require('express');

var serviceRouter = require('./lib/service_router');
var visitRouter = require('./lib/visit_router');

var app = express();
app.use('/rest', serviceRouter);
app.use('/', visitRouter);
app.use(express.static(__dirname + '/public'));

var server = app.listen(constants.get('http:port'), function() {
	console.log('Listening on port %d', server.address().port);
});