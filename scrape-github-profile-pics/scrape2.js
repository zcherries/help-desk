var fs = require('fs');
var Xray = require('x-ray');
var x = Xray();
var execSync = require('child_process').execSync;

var files = execSync('ls ./students').toString('utf8').split('\n');

var html;
files.forEach(function(filename, idx) {
	html = fs.readFileSync('./students/' + filename);
	x(html, 'img.avatar@src')(function(err, imgURI) {
		console.log(imgURI);
		execSync('wget -O ./avatars/' + idx + '.jpg ' + imgURI);
	});
});
