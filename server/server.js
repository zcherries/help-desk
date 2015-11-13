var express = require('express');
var serverHelpers = require('./server-helpers.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbHelpers = require('./db/db-helpers.js');
var HelpRequest = dbHelpers.HelpRequest;
var helpReqSchema = dbHelpers.helpReqSchema;

var app = express();

// external middleware
app.use(bodyParser());

// internal middleware
app.use(serverHelpers.printReqInfo);

/* -- BEGIN mongo setup --*/
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var helprequests;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// connect to a collection
	helprequests = mongoose.model('HelpRequest', helpReqSchema);
});
/* -- END mongo setup -- */

app.post('/', function(req, res, next) {
	// might be able to data validate client-side
	if(!dbHelpers.isSubmissionValid(req.body)) {
		res.send('Please enter valid data!');
		return;
	}
	var newHelpRequest = new HelpRequest(req.body);
	newHelpRequest.save(function(err, newHelpRequest) {
		if(err) return console.error(err);
		newHelpRequest.speak();
		res.send(req.body);
	});
});

// viewing the db
app.get('/data', function(req, res, next) {
	console.log('hit the data endpoint!');

	var html = '<script src="bower_components/jquery/dist/jquery.min.js"></script>';
			html += '<script>';
			html += '$( document ).ready(function() {';
			html +=   '$("body").on("click", ".delete", function(){ ' + dbHelpers.deleteHandler() + ' });';
			html +=   '$("body").on("mouseover", ".db-entry", function(){ console.log("mouseover!"); });';
			html += '});';
			html += '</script>';
			html += '<link rel="stylesheet" type="text/css" href="./css/styles.css">';

	helprequests.find(function(err, objects) {
		objects.forEach(function(object) {
			html += '<p class="db-entry">' + JSON.stringify(object) + '<span class="delete">X</span></p>'
		});
		res.send(html);
	});
});

app.post('/data/delete', function(req, res, next) {
	console.log('/data/delete POST!');
	console.log('req.body: ' + JSON.stringify(req.body));

	var id = req.body.id;
	helprequests.findById(id).remove(function(err, removed) {
		console.log('successfully removed: ' + removed);
		res.send();
	});

	// helprequests.findById(id, function (err, found) {
	// 	console.log(found);
	// 	res.send();
	// });
});

// static files
app.use(express.static('public'));

// handle 404
app.use(serverHelpers.handle404);

app.listen(8000);
console.log('listening on port http://localhost:8000');