module.exports.printReqInfo = function(req, res, next) {
    console.log('received a ' + req.method + ' request for ' + req.path);
    next();
};