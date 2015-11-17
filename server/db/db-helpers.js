var mongoose = require('mongoose');

module.exports.isSubmissionValid = function(submission) {
	return (submission.author && submission.content);
};

var helpReqSchema = module.exports.helpReqSchema = mongoose.Schema({
	author: String,
	content: String,
	tags: [String],
	timesubmitted: String
});

helpReqSchema.methods.speak = function() {
	console.log('-- Help Request --');
	console.log(JSON.stringify(this));
};

var HelpRequest = module.exports.HelpRequest = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');