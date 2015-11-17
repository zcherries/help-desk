var serverHelpers = require('./server-helpers.js');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbHelpers = require('./db/db-helpers.js');
var HelpRequest = dbHelpers.HelpRequest;
var helpReqSchema = dbHelpers.helpReqSchema;

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var PORT = 8000;

// external middleware
app.use(bodyParser());

// internal middleware
app.use(serverHelpers.printReqInfo);

/* -- BEGIN socket IO -- */

var handleEntryAdded;
var handleEntryDeleted;
var socketRef;


io.on('connection', function (socket) {
	console.log('new connection!');
	socketRef = socket;
	console.log('socketRef: ' + socketRef);

  socket.on('accept-hr', function(hrObj) {
  	console.log(hrObj.name + ' has just accepted a HR.');
  	console.log(JSON.stringify(hrObj));
  	acceptHelpRequest(hrObj);
  });
  socket.on('close-hr', function(hrObj) {
  	console.log(hrObj.name + ' has just closed a HR.');
  	console.log(JSON.stringify(hrObj));
  	closeHelpRequest(hrObj);
  });

  socket.on('my other event', function (data) {
    console.log(data);
  });
});
/* -- END socket IO -- */

/* -- BEGIN mongo setup --*/
var helprequests;
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// connect to a collection
	helprequests = mongoose.model('HelpRequest', helpReqSchema);
});
/* -- END mongo setup -- */


// helper functions
var acceptHelpRequest = function(hrObj) {
	var conditions = { _id: hrObj._id },
			update = { $set: { accepted: true, assignedFellow: hrObj.name } },
			options = { multi: false };

	helprequests.update(conditions, update, options, callback);

	// hopefully numAffected === 1
	function callback (err, numAffected) {
		if (err) console.error(err);
		console.log('successfully updated help request');
		socketRef.emit('fellow-accepted');
	}
};
var closeHelpRequest = function(hrObj) {
	var conditions = { _id: hrObj._id },
			update = { $set: { closed: true } },
			options = { multi: false };

	helprequests.update(conditions, update, options, callback);

	// hopefully numAffected === 1
	function callback (err, numAffected) {
		if (err) console.error(err);
		console.log('successfully updated help request');
		socketRef.emit('fellow-closed');
	}
};


/* -- BEGIN http server -- */
app.post('/', function(req, res, next) {
	// might be able to data validate client-side
	if(!dbHelpers.isSubmissionValid(req.body)) {
		res.send('Please enter valid data!');
		return;
	}
	console.log('req.body: ' + JSON.stringify(req.body));
	var newHelpRequest = new HelpRequest(req.body);
	newHelpRequest.save(function(err, newHelpRequest) {
		if(err) return console.error(err);
		socketRef.emit('entry-added', { entryAdded: 'testing' })
		newHelpRequest.speak();
		res.send(req.body);
	});
});

// viewing the db
app.get('/data', function(req, res, next) {
	console.log('fetching from DB...');
	var html = '';
	helprequests.find(function(err, objects) {
		res.send(objects);
		return;
	});
});

app.post('/data/delete', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var id = req.body.id;
	helprequests.findById(id).remove(function(err, removed) {
		socketRef.emit('entry-deleted', removed);
		console.log('successfully removed: ' + removed);
		res.send(req.body);
	});
});

// static files
app.use(express.static('./public'));

// handle 404
app.use(serverHelpers.handle404);

server.listen(PORT);
console.log('listening on port http://localhost:' + PORT);


// app.listen(PORT, function() {
// 	console.log('listening on port http://localhost:' + PORT);
// });
/* -- END http server -- */
