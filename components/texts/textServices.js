const axios = require('axios');

exports.getTextData = async function getTextData(codeArr) {
    const baseUrl = "http://www.europarl.europa.eu/doceo/document/PLACEHOLDER_EN.html";
    // regex to change id from eg. a8-0049/2016 to a-8-2016-0049
    // same code composed differently based on where it's used
    // (first comes from rcvs documents, second used as uri component)
    const transformer = /(\w)(\d)-(\d{4})\/(\d{4})/;
    const textPromises = [];
    for(let code of codeArr){
        let codeToFetch = code.replace(transformer, '$1-$2-$4-$3');
        let url = baseUrl.replace('PLACEHOLDER', codeToFetch);
        textPromises.push(axios(url).then(res => ({data: res.data, code: code})));
    };

    return Promise.all(textPromises);
};