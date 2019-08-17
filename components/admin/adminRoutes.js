const path = require('path');
const router = require('express').Router();

const { isAuth } = require('./authMw');
const {formParser} = require('./formParserMw');

const {asyncHandler} = require('../errors/common');

const { login, logout } = require('./adminControllers');
const {updateMeps} = require('../meps/mepControllers');
const {updateRcvs} = require('../rcvs/rcvControllers');
const {updateTexts} = require('../texts/textControllers');
const {buildGroupsCollection} = require('../groups/groupControllers');

router.get('/direct-login', (req, res, next) => {
    return res.sendFile('public/auth.html', 
                        {root: path.join(__dirname, '../../')
                    });
})
router.post('/direct-login', formParser, asyncHandler(login));
router.get('/logout', isAuth, asyncHandler(logout));
router.get('/update-meps', isAuth, asyncHandler(updateMeps));

router.get('/update-rcvs', isAuth, asyncHandler(updateRcvs));

router.get('/update-texts', isAuth, asyncHandler(updateTexts));

router.get('/create-groups', isAuth, asyncHandler(buildGroupsCollection));

module.exports = router;