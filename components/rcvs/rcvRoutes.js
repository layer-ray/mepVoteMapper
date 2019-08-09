const router = require('express').Router();

const {asyncHandler} = require('../errors/common');
const { getMinutesDates, getRcvs,
        getTextCodes, getByCode, 
        getById, getByDates} = require('./rcvControllers');

router.get('/get-minutes', asyncHandler(getMinutesDates));
router.get('/get-rcvs/:page', asyncHandler(getRcvs));
router.get('/get-text-codes', asyncHandler(getTextCodes));
router.get('/get-by-code/:code', asyncHandler(getByCode));
router.get('/get-by-id/:id', asyncHandler(getById));
router.post('/get-by-dates', asyncHandler(getByDates));
module.exports = router;