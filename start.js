var express = require('express');
var nconf = require('nconf').argv().env().file({ file: 'config.json' });

var serviceRouter = require('./lib/service_router');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/rest', serviceRouter);

var server = app.listen(nconf.get('http:port'), function() {
	console.log('Listening on port %d', server.address().port);
});