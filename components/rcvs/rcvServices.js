const axios = require('axios');
const cheerio = require('cheerio');

// --- PRE 9th EUROPEAN PARLIAMENT --- 
/*
const queryString = require('querystring');
const url = require('url');

// scrape links from rss feed
exports.checkRcvRssFeed = async function checkRcvRssFeed (rcvRssFeedURL) {
    const minuteDates = [];
    
    const feedData = await axios.get(rcvRssFeedURL);
    
    const $ = cheerio.load(feedData.data, {
        xmlMode: true, 
        decodeEntities: false
    });
    // Loop through all links in item looking for res-rcv docs
    // and extract the date        
    $('item link').each((i, el) => {
        const cleanLink = $(el).text().replace(/&amp;/g, "&");
        const qs = url.parse(cleanLink);
        const parameters = queryString.parse(qs.query);
        if (parameters.secondRef==="RES-RCV") {
            minuteDates.push(parameters.reference);
        }
    });

    return minuteDates;
};

// fetch rcv docx based on date
exports.fetchRcvDocx = async function fetchRcvDocx(baseUrl, datesArray){
    const docxPromises = [];
    for(const date of datesArray) {
        let docxUrl = baseUrl.replace('PLACEHOLDER', date);
        docxPromises.push(
            axios({
                    method: 'get',
                    url: docxUrl,
                    responseType: 'arraybuffer' // stream gives problem to subsequent jszip operation 
            }).then(res => ({data: res.data, filename: date}))
        );
    };
    return Promise.all(docxPromises)
};
*/
// --- POST 9th EUROPEAN PARLIAMENT --- 

// scrape links from rss feed
exports.checkRcvRssFeed = async function checkRcvRssFeed (rcvRssFeedURL) {
    const feedLinks = [];
    
    const feedData = await axios.get(rcvRssFeedURL);
    
    const $ = cheerio.load(feedData.data, {
        xmlMode: true, 
        decodeEntities: false
    });
    // Loop through all links in item looking "Roll-call votes - final edition" into the title
    // Then it replace the extension with the needed one and fill the array
    $('item').each((i, el) => {
        const titleArr = $('title', $(el)).text().split(" - ");
        if(titleArr.includes("Roll-call votes") && titleArr.includes("Final edition")) {
            let source = $('link', $(el)).text();
            if(source.slice(-4) !== 'docx') {
                source = source.replace(/\..{2,5}$/, '.docx');
            }
            feedLinks.push(source);
        };
    });

    return feedLinks;
};

// fetch rcv docx 
exports.fetchRcvDocx = async function fetchRcvDocx(links){
    const docxPromises = [];
    for(const link of links) {
        const date = link.match(/\d{4}-\d{2}-\d{2}/)[0];
        docxPromises.push(
            axios({
                    method: 'get',
                    url: link,
                    responseType: 'arraybuffer' // stream gives problem to subsequent jszip operation 
            }).then(res => ({data: res.data, filename: date}))
        );
    };
    return Promise.all(docxPromises)
};