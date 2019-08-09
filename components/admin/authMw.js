const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || '';


exports.isAuth = (req, res, next) => {
    const token = req.cookies.auth;
    try {
        jwt.verify(token, jwtSecret);
        next();
    } catch(error) {
        res.json({error: "Auth failed"});
    };
};