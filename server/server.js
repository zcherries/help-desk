var express = require('express');
var serverHelpers = require('./server-helpers.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbHelpers = require('./db/db-helpers.js');

var app = express();

/* -- BEGIN mongo setup --*/
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
var helprequests;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// connect to a collection
	helprequests = mongoose.model('HelpRequest', dbHelpers.helpReqSchema);
});
/* -- END mongo setup -- */


// external middleware
app.use(bodyParser.json());

// for debugging
app.use(serverHelpers.printReqInfo);

// viewing the db
app.get('/data', function(req, res, next) {
	console.log('hit the data endpoint!');
	// helprequests.find(function(err, objects) {
	helprequests.find(function(err, objects) {
		res.send(objects);
	});
});

// static files
app.use(express.static('public'));

// handle 404
app.use(serverHelpers.handle404);

app.listen(8000);
console.log('listening on port http://localhost:8000');