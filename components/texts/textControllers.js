const {getTextData} = require('./textServices');
const {buildTextObjects} = require('./parsingMethods');
const {getConn, getAuthConn} = require('../../db');

const Text = require('./textDAO')({
    conn: getConn(),
    db: 'eu_9th-lg',
    collection: 'texts'
});

exports.getTexts = async (req, res, next) => {
    const page = req.params.page || -1;
    const texts = await Text.getTexts(page, 20);
    res.json({texts});
};

exports.getTextsByWords = async (req, res, next) => {
    const words = req.body.words || '';
    const texts = await Text.getVotationsByTextTitleWord(words);
    
    res.json({fetchResponse: texts});
};

// admin routed
exports.updateTexts = async (req, res, next) => {
   
     const AuthText = require('./textDAO')({
        conn: getAuthConn(),
        db: 'eu_9th-lg',
        collection: 'texts'
    });
    
    const AuthRCV = require('../rcvs/rcvDAO')({
            conn: getAuthConn(),
            db: 'eu_9th-lg',
            collection: 'rcvs'
        });

    const minutesCodes = await AuthRCV.getMinutesCodes();
    const codeArr = minutesCodes
        .filter(minute => /^(A|B)(8|9)-\d{4}\/\d{4}/.test(minute._id))
        .map(minute => minute._id);

    if(codeArr.length !== 0){
        const texts = await getTextData(codeArr);
        const textObjs = buildTextObjects(texts);
        const results = await AuthText.insertTexts(textObjs);
        res.json({message: 'Text updated correctly', results});
    } else {
        res.json({message: 'No text to insert'});
    }
};