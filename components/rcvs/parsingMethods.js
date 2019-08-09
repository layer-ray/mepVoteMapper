const cheerio = require('cheerio');
const mammoth = require('mammoth');

const isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    };
    return true;
};

exports.docxToHtml = async function docxToHtml(docxs){
    const markups = [];
    for (let doc of docxs){
        markups.push({
            data: await mammoth.convertToHtml({buffer: doc.data}),
            filename: doc.filename
            });
    };
    return markups;
};
// return cheerio object to avoid load twice the same markup
exports.cleanRawMarkups = async function cleanRawMarkups(markups){
    const groupRegex = /ALDE:|ECR:|ENF:|NI:|EFDD:|GUE\/NGL:|PPE:|S&amp;D:|Verts\/ALE:/g;
    return new Promise((resolve, reject) => {
        const roughCutCheerioMarkups = [];
        for(markup of markups) {
            const normalizedListsMarkup = markup.data.value.replace(groupRegex, ',');
            const $ = cheerio.load(normalizedListsMarkup);

            // Remove intro / clarifications / summary / ..
            $('table').first().nextUntil('table').remove();

            // Remove section 'header page'
            // ("Minutes of proceedings Result of roll-call votes - Annex" in all languages)
            $('table').first().remove();

            // Remove vote corrections ( symbolics )
            $('table').each(function() {
                if($(this).text().startsWith('ПОПРАВКИ В ПОДАДЕНИТЕ')) {
                    $(this).remove();
                };
            });

            roughCutCheerioMarkups.push({
                data: $,
                filename: markup.filename
                });

            if(roughCutCheerioMarkups.length === markups.length) {
                resolve(roughCutCheerioMarkups);
            };
        };
    });
};

const typeExpansion = typeStr => {
    const strArr = typeStr.split(" ");
    let expandedStr = "";
    for (let str of strArr) {
        str = str.replace(/^am$/i, "Amendment");
        str = str.replace(/\/(\d)$/, " | vote $1");
        if(str.indexOf("=") !== -1) {
            piecesArr = str.split("=");
            let restStr = '';
            // string with = terminates with =, so 
            // array last meaningful item is length -2
            for (let i=1; i< piecesArr.length -1; i++) {
                restStr+= i === piecesArr.length - 2
                                    ? piecesArr[i]
                                    : piecesArr[i] + ",";
            };
            str = `${piecesArr[0]} (identical to ${restStr})`;
        };
        str = str.replace(/pc(\d+)/gi, " [corresponding part $1]");

        expandedStr += str + " ";
    };

    return expandedStr;
};

exports.jsonDocsFromCheerioMarkups = function jsonDocsFromCheerioMarkups(cleanMarkups) {
    const jsonData = [];
    for(let cleanMarkup of cleanMarkups) {
        const dateRegex = /(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}:\d{2}:\d{2}).\d{3}/;
        const codeRegex = /^[A-Z\-]*\d\-\d{4}\/\d{4}\s\-/;
        const votations = [];
        let votation = {};
        let namesArr = [];
        let title = '';
        let titleArr = [];        
        let $ = cleanMarkup.data;
        // create json votation object
        $('table').each(function () {
            // votations data starts with two consequent tables
            // (unique in the residual document)
            if ($(this).next().is('table')) {
                // if votation obj is not empty means that
                // is still the old one just completed
                // push it and reset
                if(!isEmpty(votation)) {
                    votations.push(votation);
                    votation = {};
                };
                title = $(this).text();            // (unique in the residual document)
                // sample title:
                // RC-B9-0014/2019 - § 1918/07/2019 11:26:25.000
                votation.title = title;
                votation.filename = cleanMarkup.filename;
                
                if (codeRegex.test(title)){
                    const codeExcerpt = title.match(codeRegex)[0];
                    votation.ABNumber = codeExcerpt.substring(0, codeExcerpt.length - 2).trim();
                    title = title.replace(codeExcerpt, '');
                };

                if(dateRegex.test(title)) {
                    const dateExcerpt = title.match(dateRegex)[0];
                    const dateStr = dateExcerpt.replace(dateRegex, "$3-$2-$1T$4Z");
                    votation.date = new Date(dateStr);
                    title = title.replace(dateExcerpt, '');
                };
                
                titleArr = title.split(' - ');

                // A stands for reports (have a rapporteur), B stands for motions (no rapp)
                if(votation.ABNumber && votation.ABNumber.indexOf("A") !== -1) {
                        votation.rapporteur = titleArr[0].trim();
                        votation.type = typeExpansion(titleArr[1].trim());
                } else {
                    votation.type = typeExpansion(titleArr.join(" - ").trim());
                };
                
            } else if (/\d+\+$/.test($(this).text())) {  // table followed by list of names
                namesArr = $(this).nextUntil('table').text().split(',').sort();
                votation.favour = namesArr.map(name => name.trim().toLowerCase());
            } else if (/\d+-$/.test($(this).text())) {  // table followed by list of names
                namesArr = $(this).nextUntil('table').text().split(',').sort();
                votation.against = namesArr.map(name => name.trim().toLowerCase());
            } else if(/\d+0$/.test($(this).text())) {  // table followed by list of names
                namesArr = $(this).nextUntil('table').text().split(',').sort();
                votation.abstention = namesArr.map(name => name.trim().toLowerCase());
            } else {
                votation.otherText = $(this).nextUntil('table').text().split(',');
            };
        });
        jsonData.push(votations);
    };
    return jsonData;
};