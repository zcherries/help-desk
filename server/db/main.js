var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	// ...
});

var helpReqSchema = mongoose.Schema({
	author: String,
	content: String
});

helpReqSchema.methods.speak = function() {
	var author = this.author || 'no author';
	var content = this.content || 'empty message';
	console.log('-- Help Request --');
	console.log(author + ' wrote \"' + content + '\"');
};

var HelpRequest = mongoose.model('HelpRequest', helpReqSchema);

var testRequest = new HelpRequest({ author: 'William Simonian',
															 content: 'Help us with Mongo, please.' });
testRequest.speak();

testRequest.save(function(err, testRequest) {
	if (err) return console.error(err);
	testRequest.speak();
});


db.getCollection('helprequests').find(function(err, objects) {
	if (err) return console.err(err);
	console.log(objects);
});

// db.once('close', function(callback) {
// 	// close
// });

// // time goes by...
// Kitten.find(function(err, kittens) {
// 	if (err) return console.error(err);
// 	console.log(kittens);
// });

// Kitten.find({ name: /^Fluff/ }, function(err, kittens) {
// 	if (err) return console.error(err);
// 	console.log(kittens);
// });