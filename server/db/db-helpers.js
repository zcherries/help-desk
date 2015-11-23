var mongoose = require('mongoose');

module.exports.isSubmissionValid = function(submission) {
	return (submission.author && submission.content);
};

var helpReqSchema = module.exports.helpReqSchema = mongoose.Schema({
	author: String,
	content: String,
	tags: [String],
	timesubmitted: String,
	timeclosed: String,
	accepted: Boolean,
	closed: Boolean,
	assignedFellow: String,
	feedback: String
});

var bugAlertSchema = module.exports.bugAlertSchema = mongoose.Schema({
	author: String,
	content: String,
	timesubmitted: String
});

var userSchema = module.exports.userSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	gitHandle: String,
	location: String,
	imgsrc: String,
	isFellow: Boolean,
	availability: Number
});



// var fellowSchema = module.exports.fellowReqSchema = mongoose.Schema({
// 	firstname: String,
// 	lastname: String,
// 	email: String,
// 	gitHandle: String,
// 	location: String,
// 	imgsrc: String,
// 	availability: Number
// });

helpReqSchema.methods.speak = function() {
	console.log('-- Help Request --');
	console.log(JSON.stringify(this));
};

bugAlertSchema.methods.speak = function() {
	console.log('-- Bug Alert --');
	console.log(JSON.stringify(this));
};

userSchema.methods.speak = function() {
	console.log('-- New User --');
	console.log(JSON.stringify(this));
};

var HelpRequest = module.exports.HelpRequest = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');
var BugAlert = module.exports.BugAlert = mongoose.model('BugAlert', bugAlertSchema, 'bugalerts');
var User = module.exports.User = mongoose.model('User', userSchema, 'users');



