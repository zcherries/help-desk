var serverHelpers = require('./server-helpers.js');
var express = require('express');
var http = require('http');
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbHelpers = require('./db/db-helpers.js');
var HelpRequest = dbHelpers.HelpRequest;
var helpReqSchema = dbHelpers.helpReqSchema;
var BugAlert = dbHelpers.BugAlert;
var bugAlertSchema = dbHelpers.bugAlertSchema;
var User = dbHelpers.User;
var userSchema = dbHelpers.userSchema;

var townhallTopicSchema = dbHelpers.townhallTopicSchema;

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
var helprequests, bugalerts, townhallTopics, users; // Collection names
mongoose.connect('mongodb://localhost/helpdesk');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// connect to collections
	helprequests = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');
	bugalerts = mongoose.model('BugAlert', bugAlertSchema, 'bugalerts');
	users = mongoose.model('User', userSchema, 'users');
	townhallTopics = mongoose.model('TownhallTopic', townhallTopicSchema)
});
/* -- END mongo setup -- */


// Help Request helper functions

// var countOpenH = function(hrObj) {
//   var conditions = { _id: hrObj._id },
//   helprequests.find()
// }

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
		socketRef.emit('entry-added', { entryAdded: 'testing' });
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
	});
});

// retrieve Help Request by ID
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
        // socketRef.emit('entry-deleted', removed);
        console.log('successfully removed: ' + removed);
        res.send(req.body);
    });
});

// retrieve BugAlerts
app.get('/data/bugalerts', function(req, res, next) {
    console.log('fetching from bugalerts Collection...');
    var html = '';
    bugalerts.find(function(err, objects) {
        res.send(objects);
    });
});

// add new Bug Alert
app.post('/data/bugs', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var newBugAlert = new BugAlert(req.body);
	newBugAlert.save(function(err, newBugAlert) {
		if(err) return console.error(err);
		socketRef.emit('bugalert-added', { entryAdded: 'testing' });
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


// app.get('/data/users', function(req, res, next) {
//  users.find(function(err, userEntries) {
//      return res.send(userEntries);
//  });
// });



  var usersList = [
    {firstname:"Andrew",lastname:"Howes",email:"none",gitHandle:"andrewhws",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/0.jpg", isFellow: false, availability: 0},
    {firstname:"Aram",lastname:"Simonian",email:"none",gitHandle:"aram91",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/1.jpg", isFellow: false, availability: 0},
    {firstname:"Casandra",lastname:"Silva",email:"silvacasandra@gmail.com",gitHandle:"casandrawith1s",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/2.jpg", isFellow: false, availability: 0},
    {firstname:"Chelsea",lastname:"Cheung",email:"chelseatcheung@gmail.com",gitHandle:"chelseatcheung",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/3.jpg", isFellow: false, availability: 0},
    {firstname:"Cory",lastname:"Dang",email:"cory.q.dang@gmail.com",gitHandle:"coryd4ng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/4.jpg", isFellow: false, availability: 0},
    {firstname:"Seyi",lastname:"Williams",email:"none",gitHandle:"git2go",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/5.jpg", isFellow: false, availability: 0},
    {firstname:"Jeffrey",lastname:"Yang",email:"jeffycyang@gmail.com",gitHandle:"jeffycyang",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/6.jpg", isFellow: false, availability: 0},
    {firstname:"Jonathan",lastname:"Kvicky",email:"jonkvix@gmail.com",gitHandle:"jonkvix",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/7.jpg", isFellow: false, availability: 0},
    {firstname:"Jonathan",lastname:"Tamsut",email:"jtamsut1993@gmail.com",gitHandle:"jtamsut",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/8.jpg", isFellow: false, availability: 0},
    {firstname:"Kevin",lastname:"Cheng",email:"09chengk@gmail.com",gitHandle:"k-cheng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/9.jpg", isFellow: false, availability: 0},
    {firstname:"Marc",lastname:"Reicher",email:"msreicher@gmail.com",gitHandle:"marcreicher",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/10.jpg", isFellow: false, availability: 0},
    {firstname:"Marcus",lastname:"Ellis",email:"none",gitHandle:"marcusmellis89",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/11.jpg", isFellow: false, availability: 0},
    {firstname:"Mike",lastname:"Martin",email:"martinms.usc@gmail.com",gitHandle:"martinms-usc",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/12.jpg", isFellow: false, availability: 0},
    {firstname:"Matt",lastname:"Murkidjanian",email:"matthewmurkidjanian@gmail.com",gitHandle:"mmurkidjanian",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/13.jpg", isFellow: false, availability: 0},
    {firstname:"Nick",lastname:"Krein",email:"nkreinmusic@gmail.com",gitHandle:"nkreinmusic",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/14.jpg", isFellow: false, availability: 0},
    {firstname:"Stephanie",lastname:"Raad",email:"none",gitHandle:"Stephyraad",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/15.jpg", isFellow: false, availability: 0},
    {firstname:"Avi",lastname:"Samloff",email:"avi.samloff@gmail.com",gitHandle:"theavish",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/16.jpg", isFellow: false, availability: 0},
    {firstname:"Timothy",lastname:"Lai",email:"timothy.lai@gmail.com",gitHandle:"tim-lai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/17.jpg", isFellow: false, availability: 0},
    {firstname:"Tina",lastname:"Lai",email:"none",gitHandle:"tinalai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/18.jpg", isFellow: false, availability: 0},
    {firstname:"Vidiu",lastname:"Chiu",email:"vidiuchiu@gmail.com",gitHandle:"VDUCHEW",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/19.jpg", isFellow: false, availability: 0},
    {firstname:"Zachary",lastname:"Herries",email:"hotziggity@gmail.com",gitHandle:"zcherries",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/21.jpg", isFellow: false, availability: 0},
    {firstname:"William",lastname:"Carroll",email:"wcarroll@wustl.edu",gitHandle:"wpcarro",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/20.jpg", isFellow: false, availability: 0},
    {firstname:"Thomas",lastname:"Greenhalgh",email:"thomas.greenhalgh@gmail.com",gitHandle:"tgreenhalgh",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/thomas.jpeg", isFellow: true, availability: 0},
    {firstname:"Joe",lastname:"Nayigiziki",email:"joseph.nayigiziki@makersquare.com",gitHandle:"Nayigiziki",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/joe_n.jpeg", isFellow: true, availability: 1},
    {firstname:"Melinda",lastname:"Bernardo",email:"melindabernardo@gmail.com",gitHandle:"melindabernardo",location:"Los Angeles, CA.",imgsrc:"../assets/fellow-avatars/melinda.jpeg", isFellow: true, availability: 1},
    {firstname:"Ricky",lastname:"Walker",email:"rickwalk45@gmail.com",gitHandle:"Unconfined",location:"Baton Rouge, LA.",imgsrc:"../assets/fellow-avatars/ricky_w.jpeg", isFellow: true, availability: 2},
    {firstname:"Irving",lastname:"Barajas",email:"irvingb232@gmail.com",gitHandle:"irvingaxelb",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/irving.jpeg", isFellow: true, availability: 3}
  ];


// retrieve users
app.get('/data/users', function(req, res, next) {
	console.log('fetching from users Collection...');
	users.find()
    .then(function(userEntries) {
		res.send(userEntries);
	});
});


// add new users?
// app.post('/data/users', function(req, res, next) {
//     // might be able to data validate client-side
//     console.log('req.body: ' + JSON.stringify(req.body));
//     var newUser = new User(req.body);
//     newUser.save(function(err, newUser) {
//         if(err) {
//             return console.error(err);
//         }
//         // socketRef.emit('entry-added', { entryAdded: 'testing' })
//         // newHelpRequest.speak();
//         res.send(req.body);
//     });
// });


// OR
app.post('/data/bugalerts', function(req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));
    var newBugAlert = new BugAlert(req.body);
    newBugAlert.save(function(err, newBugAlert) {
        if(err) return console.error(err);
        socketRef.emit('bugalert-added', { entryAdded: 'testing' })
        newBugAlert.speak();
        res.send(req.body);
    });
});


// delete users
app.post('/data/users/delete', function(req, res, next) {
	console.log('req.body: ' + JSON.stringify(req.body));
	var id = req.body.id;
	users.findById(id).remove(function(err, removed) {
		// socketRef.emit('entry-deleted', removed);
		console.log('successfully removed: ' + removed);
		res.send(req.body);
	});
});

//townhall topics handlers
app.get('/townhall/topics', function(req, res, next) {
	console.log('In app.get townhall topics');
	townhallTopics.find({}).sort({ _id: -1 }).then(function(topics) {
		res.send({status: 200, data: topics});
	});
});

app.post('/townhall/topics', function(req, res, next) {
	console.log('In app.post townhall topics');
	townhallTopics.findOne({title: req.body.title}, function(err, match){
		if (err) console.error("Townhall topic post error: ", err);
		else {
			if (!match) {
				townhallTopics.create(req.body).then(function(){
					townhallTopics.find({}).sort({ _id: -1 }).then(function(topics) {
						res.send({status: 201, data: topics});
					});
				});
			} else {
				res.status(400).send({status: 400, data: null, message: "Topic not found"});
			}
		}
	});
});

app.post('/townhall/topics/topic/question', function(req, res, next) {
	console.log("I'm inside app.post topic/question")
	townhallTopics.findOne({_id: req.body.topic_id}, function(err, topic) {
		if (err) console.error("Townhall topic question post error: ", err);
		else {
			if (topic) {
				var question = { title: req.body.title,
					resources: req.body.resources,
					votes: req.body.votes
				}
				topic.questions.push(question);
				topic.save(function(err) {
					if (err) { throw err; }
					else { res.send({status: 201, data: topic.questions}); }
				});
			} else {
				res.status(400).send({status: 400, data: null, message: "Topic not found"});
			}
		}
	});
});

app.post('/townhall/topics/topic/question/*', function(req, res, next) {
	console.log("About to edit question")
	townhallTopics.findOne({_id: req.body.topic_id}, function(err, topic) {
		if (err) { console.error("Finding topic Error: ", err); }

		var question = topic.questions.id(req.body.question_id);
		if (req.body.vote) {
			question.votes = req.body.vote;
		} else if (req.body.resources) {
			question.resources = req.body.resources;
		}

		topic.save(function(err) {
			if (err) { throw err; }
			else {
				res.send({status: 201, data: topic.questions}); }
		});
	});
})

// static files
app.use(express.static('./public'));

// handle 404
app.use(serverHelpers.handle404);

server.listen(PORT);
console.log('listening on port http://localhost:' + PORT);

console.log('new users being addded?');

var usersInitialized = false;

if (!usersInitialized) {
  usersList.forEach(function (item, i, array) {
    var newUser = new User(item);
    newUser.save(function (err, obj) {
      if (err) {
        return console.error(err);
      }
      console.log('-- New User --');
      console.log(JSON.stringify(obj, null, 2));
    });
    usersInitialized = true;
  });
}

// app.listen(PORT, function() {
// 	console.log('listening on port http://localhost:' + PORT);
// });
/* -- END http server -- */
