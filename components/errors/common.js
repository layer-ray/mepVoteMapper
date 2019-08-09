// credits to Marcos Casagrande [STACK OVERFLOW]
exports.asyncHandler =  fn => 
                        (req, res, next) => 
                        Promise.resolve(fn(req, res, next))
                                .catch(next);

exports.errorLogger = (err, req, res, next) => {
    // TODOS: insert winston logger to be used in production
    console.error(err);
    next(err);
};

exports.clientErrorHandler = (err, req, res, next) => {
    req.xhr
        ?   res.status(500).json({error: 'Something failed about the request management'})
        : next(err);
};

exports.generalErrorHandler = (err, req, res, next) => {
    res.status(500).json({error: 'Server has broken down :O'});
};