const axios = require('axios');

const mepListURL = 'http://www.europarl.europa.eu/meps/en/full-list/xml';

const checkIfCapital = char  =>
    char === char.toUpperCase();

exports.buildMepsObj = async () => {
    /* loop three times over the mep array (optimize?)
        1. creates firstname & lastname fields
        2. check if lastname occurs more than once
        3. add the votename to each mep based on the previous check
    */
    const {data} = await axios(mepListURL);
    const extendedMepArr = data.list.map(mep => {
        let names = mep.fullName.split(' ');
        let mepFirstNames = [];
        let mepLastNames = [];
        for(let name of names) {
            if( (checkIfCapital(name[name.length -1]) || 
                /^de$|^del$|^dos$|^van$|^in$|^\'t$|^i$/.test(name)) &&
                /[^\.]$/.test(name)) {
                mepLastNames.push(name);
            } else {
                mepFirstNames.push(name);
            };
        };

        mep.firstName = mepFirstNames.join(' ');
        mep.lastName = mepLastNames.join(' ');
        mep.fullName = mep.fullName.toLowerCase();
        return mep;
    })

    // Check for meps with the same last name
    let occurrences = {};
    extendedMepArr.forEach((el, ix) => occurrences[el.lastName] 
        ? occurrences[el.lastName].push(ix) 
        : occurrences[el.lastName] = [ix]);
                
    // Mep with lastname that occur two or more times are indicated
    // in the votations list adding their first name on front
    extendedMepArr.forEach(mepObj => {
        mepObj.voteName = occurrences[mepObj.lastName].length > 1 ?
                            `${mepObj.lastName} ${mepObj.firstName}`.toLowerCase() :
                            mepObj.lastName.toLowerCase();
        
        // Had no clue how to abstract this special case ...
        if(mepObj.lastName === "of) DARTMOUTH") {
            mepObj.voteName = "(the earl of) dartmouth";
        };
    });

    return extendedMepArr;
};