var express = require('express');
var serverHelpers = require('./server-helpers.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();


/* -- HOOK UP TO MONGO DB SERVER --*/
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// ...
});


// external middleware
app.use(bodyParser.json());

// for debugging
app.use(serverHelpers.printReqInfo);

// viewing the db
app.get('/data', function(req, res, next) {
	Collection.find(function(err, objects) {
		res.send(objects);
	});
});

// static files
app.use(express.static('public'));

// handle 404
app.use(serverHelpers.handle404);

app.listen(8000);
console.log('listening on port http://localhost:8000');