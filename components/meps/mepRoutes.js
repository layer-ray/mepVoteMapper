const router = require('express').Router();

const {asyncHandler} = require('../errors/common');
const {getMeps, getMepByLastName, 
       getSortedMep, getGroups} = require('./mepControllers');

router.post('/get-mep', asyncHandler(getMepByLastName));
router.get('/get-meps/:page', asyncHandler(getMeps));
router.get('/get-all', asyncHandler(getMeps));
router.get('/sorted-meps', asyncHandler(getSortedMep));
router.get('/groups', asyncHandler(getGroups));

module.exports = router;