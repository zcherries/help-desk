var express = require('express');
var serverHelpers = require('./server-helpers.js');
var bodyParser = require('body-parser');

var app = express();

// external middleware
app.use(bodyParser.json());

// for debugging
app.use(serverHelpers.printReqInfo);

// static files
app.use(express.static('../public'));

// handle 404
app.use(serverHelpers.handle404);

app.listen(8000);
console.log('listening on port http://localhost:8000');