const formidable =  require('formidable');

exports.formParser = (req, res, next) => {
    new formidable.IncomingForm().parse(req, (err, fields) => {
        req.parsed_fields = fields;
        next();
    });
};