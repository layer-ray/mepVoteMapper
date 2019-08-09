const {buildMepsObj} = require('./mepServices');
const {getConn, getAuthConn} = require('../../db');

const MEP = require('./mepDAO')({
    conn: getConn(),
    db: 'eu_9th-lg',
    collection: 'meps'
});

exports.getMeps = async (req, res, next) => {
    const page = req.params.page || -1;
    const currentChunk = await MEP.getMeps(page, 20);
    res.json({meps: currentChunk });
};

exports.getMepByLastName = async (req, res, next) => {
    const { mepName } = req.body;
    const matchingMeps = await MEP.getMatchingLastNames(mepName);
    res.json({fetchResponse:matchingMeps});
};

exports.getSortedMep = async (req, res, next) => {
    const groups = await MEP.getMepsSortedByGroup();
    res.json({fetchResponse:groups});
};

exports.getGroups = async (req, res, next) => {
    const groups = await MEP.getGroups();
    res.json({fetchResponse:groups});
};

// admin routed
exports.updateMeps = async (req, res, next) => {
    
    const AuthMEP = require('./mepDAO')({
        conn: getAuthConn(),
        db: 'eu_9th-lg',
        collection: 'meps'
    });
    
    const mepList = await buildMepsObj();
    const insRes = await AuthMEP.insertMeps(mepList);
    res.json({message: 'Everything went good', inserted: insRes.insertedCount});
};