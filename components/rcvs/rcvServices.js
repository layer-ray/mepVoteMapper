const queryString = require('querystring');
const url = require('url');

const axios = require('axios');
const cheerio = require('cheerio');

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