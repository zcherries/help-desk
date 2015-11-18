var serverHelpers = require('./server-helpers.js');
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbHelpers = require('./db/db-helpers.js');
var HelpRequest = dbHelpers.HelpRequest;
var helpReqSchema = dbHelpers.helpReqSchema;
var BugAlert = dbHelpers.BugAlert;
var bugAlertSchema = dbHelpers.bugAlertSchema;

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var PORT = 8000;

// external middleware
app.use(bodyParser());

// internal middleware
app.use(serverHelpers.printReqInfo);

/* -- BEGIN socket IO -- */
var socketRef; // keep this for closure ;)
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
});
/* -- END socket IO -- */


/* -- BEGIN mongo setup --*/
var helprequests, bugalerts; // Collection names
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// connect to collections
	helprequests = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');
	bugalerts = mongoose.model('BugAlert', bugAlertSchema, 'bugalerts');
});
/* -- END mongo setup -- */


// Help Request helper functions
var acceptHelpRequest = function(hrObj) {
	var conditions = { _id: hrObj._id },
			update = { $set: { accepted: true, assignedFellow: hrObj.name } },
			options = { multi: false };

	helprequests.update(conditions, update, options, callback);

	function callback (err, numAffected) {
		if (err) console.error(err);
		console.log('successfully updated help request');
		socketRef.emit('fellow-accepted');
	}
};
var closeHelpRequest = function(hrObj) {
	var timestamp = new Date();
	var conditions = { _id: hrObj._id },
			update = { $set: { closed: true, timeclosed: timestamp } },
			options = { multi: false };

	helprequests.update(conditions, update, options, callback);

	function callback (err, numAffected) {
		if (err) console.error(err);
		console.log('successfully updated help request');
		// send feedback survey
		socketRef.broadcast.emit('fellow-closed', hrObj);
	}
};
var addFeedbackSurvey = function(hrObj) {
	var conditions = { _id: hrObj._id },
			update = { $set: { feedback: hrObj.feedback } },
			options = { multi: false };

	helprequests.update(conditions, update, options, callback);

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

// feedback forms
app.post('/feedback', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var id = req.body.id;
	addFeedbackSurvey(req.body);
});

// retrieve Help Requests
app.get('/data', function(req, res, next) {
	console.log('fetching from helprequests Collection...');
	var html = '';
	helprequests.find(function(err, objects) {
		res.send(objects);
		return;
	});
});
// retrieve Help Request
app.get('/data/id=*', function(req, res, next) {
	console.log('here');
	// grab unique db entry ID
	var id = path.parse(req.path).base.slice(3);
	helprequests.findById(id)
		.then(function(found) {
			if (!found) {  
				return res.send('No entry found for _id: ' + id);
			}
			return res.send(found);
		});
});
// delete Help Requests
app.post('/data/delete', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var id = req.body.id;
	helprequests.findById(id).remove(function(err, removed) {
		socketRef.emit('entry-deleted', removed);
		console.log('successfully removed: ' + removed);
		res.send(req.body);
	});
});

// retrieve BugAlerts
app.get('/data/bugs', function(req, res, next) {
	console.log('fetching from bugalerts Collection...');
	var html = '';
	bugalerts.find(function(err, objects) {
		res.send(objects);
		return;
	});
});
// add new Bug Alert
app.post('/data/bugs', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var newBugAlert = new BugAlert(req.body);
	newBugAlert.save(function(err, newBugAlert) {
		if(err) return console.error(err);
		socketRef.emit('bugalert-added', { entryAdded: 'testing' })
		newBugAlert.speak();
		res.send(req.body);
	});
});

// delete BugAlerts
app.post('/data/bugs/delete', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var id = req.body.id;
	bugalerts.findById(id).remove(function(err, removed) {
		socketRef.emit('bugalert-deleted', removed);
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
