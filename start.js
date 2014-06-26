var constants = require('./lib/constants');
var express = require('express');

var serviceRouter = require('./lib/service_router');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/rest', serviceRouter);

var server = app.listen(constants.get('http:port'), function() {
	console.log('Listening on port %d', server.address().port);
});