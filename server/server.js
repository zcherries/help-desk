var express = require('express');
var serverHelpers = require('./server-helpers.js');

var app = express();

app.use(serverHelpers.printReqInfo);

app.use(express.static('public'));

app.listen(8000);
console.log('listening on port http://localhost:8000');