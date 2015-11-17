var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// ...
});

var helpReqSchema = module.exports.helpReqSchema = mongoose.Schema({
	author: String,
	content: String,
	tags: [String],
	timesubmitted: String
});

helpReqSchema.methods.speak = function() {
	console.log('-- Help Request --');
	for (var key in this) {
		console.log(key, this[key]);
	}
};

var HelpRequest = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');