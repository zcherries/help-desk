module.exports.printReqInfo = function(req, res, next) {
    console.log('received a ' + req.method + ' request for ' + req.path);
    next();
};

module.exports.handle404 = function(req, res, next) {
	res.status(404);
	res.send('sorry... 404');
};
