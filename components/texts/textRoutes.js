const router = require('express').Router();

const {getTexts, getTextsByWords} = require('./textControllers');

const {asyncHandler} = require('../errors/common');

router.get('/get-texts/:page', asyncHandler(getTexts));
router.post('/get-text-by-title', asyncHandler(getTextsByWords));

module.exports = router;