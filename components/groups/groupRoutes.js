const router = require('express').Router();

const {asyncHandler} = require('../errors/common');

const {getGroups} = require('./groupControllers');

router.get('/get-groups', asyncHandler(getGroups));

module.exports = router;