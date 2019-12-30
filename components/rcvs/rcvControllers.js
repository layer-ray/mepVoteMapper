const {checkRcvRssFeed, fetchRcvDocx} = require('../rcvs/rcvServices');
const {docxToHtml, cleanRawMarkups, jsonDocsFromCheerioMarkups} = require('../rcvs/parsingMethods');

const {getConn, getAuthConn} = require('../../db');

const RCV = require('./rcvDAO')({
    conn: getConn(),
    db: 'eu_9th-lg',
    collection: 'rcvs'
});

const rssFeedUrl = 'http://www.europarl.europa.eu/rss/doc/minutes-plenary/en.xml';
//const docxUrl = `http://www.europarl.europa.eu/sides/getDoc.do?pubRef=-//EP//NONSGML+PV+PLACEHOLDER+RES-RCV+DOC+WORD+V0//EN&language=EN`;

exports.getMinutesDates = async (req, res, next) => {
    const files = await RCV.getInsertedFiles();
    res.json({files})
}

exports.getRcvs = async (req, res, next) => {
    let page = req.params.page || -1;
    let currentChunk = await RCV.getRcvs(page, 20);
    res.json({meps: currentChunk });
};

exports.getTextCodes = async(req, res, next) => {
    let codes = await RCV.getMinutesCodes();
    res.json({codes});
};

exports.getByCode = async (req, res, next) => {
    let code = decodeURIComponent(req.params.code) || ""
    let codeVotation = await RCV.getVotationsByCode(code);
    res.json({fetchResponse: codeVotation});
};

exports.getById = async (req, res, next) => {
    let id = decodeURIComponent(req.params.id) || "";
    let idVotation = await RCV.getVotationById(id);
    res.json({fetchResponse: idVotation});
};

exports.getByDates = async (req, res, next) => {
    const {dates} = req.body;
    let rcvs = await RCV.getVotationsByDates(dates);
    
    res.json({fetchResponse: rcvs});
};

// admin routed
// custom docs can be passed in place of the feed
exports.updateRcvs = async (req, res, next) => {
    const AuthRCV = require('./rcvDAO')({
        conn: getAuthConn(),
        db: 'eu_9th-lg',
        collection: 'rcvs'
    });
    await AuthRCV.removeAllRcvs();
    const docs = req.docs || await checkRcvRssFeed(rssFeedUrl);
    const alreadyInDocs = await AuthRCV.getInsertedFiles();
     let toCreate = [];
    for(let doc of docs) {
        if (!alreadyInDocs.find(el => el._id === doc)) {
            toCreate.push(doc);
        };
    };
    if (toCreate.length === 0) {
        res.json({message: 'Everything up to date! :D'});
    } else {
        console.log('minutes to insert:', toCreate);
        const docxs = await fetchRcvDocx(toCreate);
       console.log('fetched');
        const markups = await docxToHtml(docxs);
        console.log('parsed');
        const cleanMarkups = await cleanRawMarkups(markups);
        console.log('cleaned');
        const jsonData = await jsonDocsFromCheerioMarkups(cleanMarkups);
        console.log('jsoned');
        for( votations of jsonData) {
            await AuthRCV.insertRcvs(votations);
        }
        
        console.log('bulked');
        res.json({message: 'ok'});
    }
};