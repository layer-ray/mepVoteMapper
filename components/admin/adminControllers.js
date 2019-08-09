const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {createAuthConn} = require('../../db');

const admin_user = process.env.ADMIN_USER;
const admin_pwd = process.env.ADMIN_PASSWORD;
const jwt_secret = process.env.JWT_SECRET;



exports.login = async (req, res, next) => {
            
    const {user, pwd} =  req.parsed_fields;
    
    if (pwd && admin_pwd &&
        admin_user && jwt_secret &&
        user === admin_user && 
        await bcrypt.compare(pwd, admin_pwd)) {
            await createAuthConn();
            // all env vars read and matching credentials 
            const token = jwt.sign(
                {rnd: "MALWARE DETECTED"},
                jwt_secret,
                {expiresIn: '1h'}
            );
            //res.json({fetchResponse: token});
            res.cookie('auth', token, {maxAge: 60 * 60 * 1000})
                .sendFile('public/dashboard.html', 
                {root: path.join(__dirname, '../../')
        });
    }  else {
        res.json({error: 'login failed'});
    };
};