var mongoose = require('mongoose');

module.exports.isSubmissionValid = function(submission) {
	return (submission.author && submission.content);
};


var helpReqSchema = module.exports.helpReqSchema = mongoose.Schema({
	author: String,
	content: String
});

module.exports.deleteHandler = function() {
	// var fxn = 'var id = alert(JSON.parse($(this).text())._id);';
	// 		fxn += collection + '.findById(id, function (err, found) {';
	// 	  fxn += 'console.log(found);';
	// 		fxn += '});';
	// return fxn;

	// alert server of a delete operation via an ajax post req
	// return 'console.log($(this).closest(\"p\").text().replace(/X$/,\"\"));'
	return 'var data = { id: JSON.parse($(this).closest(\"p\").text().replace(/X$/,\"\"))._id};  \
	 $.post(\"http://localhost:8000/data/delete\", data, function(data) {  \
		 console.log(\"posted!\");  \
	});';
};


helpReqSchema.methods.speak = function() {
	var author = this.author || 'no author';
	var content = this.content || 'empty message';
	console.log('-- Help Request --');
	console.log(author + ' wrote \"' + content + '\"');
};

var HelpRequest = module.exports.HelpRequest = mongoose.model('HelpRequest', helpReqSchema, 'helprequests');

// db.once('close', function(callback) {
// 	// close
// });

// Kitten.find({ name: /^Fluff/ }, function(err, kittens) {
// 	if (err) return console.error(err);
// 	console.log(kittens);
// });