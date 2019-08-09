const cheerio = require('cheerio');

exports.buildTextObjects = textData => {
    const textArr = [];
    for (let doc of textData) {
        const $ = cheerio.load(doc.data);
        const text = {};
        $('head').children('meta').each((_,child) => {
            if($(child).attr('name') === "available") {
                text.availableFrom = $(child).prop('content');
            };

            if($(child).attr('name') === 'title') {
                text.title = $(child).prop('content');
            }
        });
        text.ABNumber = doc.code;
        textArr.push(text);
    };
    return textArr;
};
