// grabs students' github usernames

var fs = require('fs');
var Xray = require('x-ray');
var x = Xray();
var execSync = require('child_process').execSync;

var html = fs.readFileSync('./mks26.html');

var urls;
x(html, 'span.team-member-username', [{
  username: 'a',
}])(function(err, obj) {
	usernames = obj.map(function(user) {
		return user.username.trim();
	});
	usernames.forEach(function(username, idx) {
		console.log('username: ' + username);
		execSync('echo ' + username + ' >> ./git-usernames.txt');
	});
});