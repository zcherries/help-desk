var fs = require('fs');
var Xray = require('x-ray');
var x = Xray();
var execSync = require('child_process').execSync;

var url = 'https://github.com/';
var html = fs.readFileSync('./mks26.html');

var urls;
x(html, 'span.team-member-username', [{
  username: 'a',
}])(function(err, obj) {
	urls = obj.map(function(user) {
		return url + user.username.trim();
	});
	console.log(urls);

	urls.forEach(function(url, idx) {
		console.log('url: ' + url);
		execSync('curl ' + url + ' > ./students/' + idx + '.html');
	});
});