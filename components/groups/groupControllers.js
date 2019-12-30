const {getConn, getAuthConn} = require('../../db');

const Group = require('./groupDAO')({
    conn: getConn(),
    db: 'eu_9th-lg',
    collection: 'groups'
});


exports.getGroups = async (req, res, next) =>{
    let groups =  await Group.getGroups();
    res.json({fetchResponse: groups});
};

// admin routed
// groups collection is built manually; too many fields
// are based on personal preference (identifier color, 
// left-to-right location, acronim)
exports.buildGroupsCollection = async (req, res, next) => {
    const groupArr = [
        {
            name: "Non-attached Members",
            idColor: "#777",
            acronim: 'na',
            LtR: -1
        },
        {
            name: "European Conservatives and Reformists Group",
            idColor: "#138",
            acronim: 'ecr',
            LtR: 6
        },
        {
            name: "Group of the European People's Party (Christian Democrats)",
            idColor: "#22F",
            acronim: 'epp',
            LtR: 5
        },
        {
            name: "Group of the Greens/European Free Alliance",
            idColor: "#2D2",
            acronim: 'efa',
            LtR: 3
        },
        {
            name: "Identity and Democracy Group",
            idColor: "#334",
            acronim: 'id',
            LtR: 7
        },
        {
            name: "Group of the European United Left - Nordic Green Left",
            idColor: "#8E2",
            acronim: 'eul',
            LtR: 1
        },
        {
            name: "Group of the Progressive Alliance of Socialists and Democrats in the European Parliament",
            idColor: "#F22",
            acronim: 'pes',
            LtR: 2
        },
        {
            name: "Renew Europe Group",
            idColor: "#46A",
            acronim: 're',
            LtR: 4
        },
    ];
    
    const AuthGroup = require('./groupDAO')({
        conn: getAuthConn(),
        db: 'eu_9th-lg',
        collection: 'groups'
    });

    await AuthGroup.insertGroups(groupArr);
    res.json({fetchResponse: "Groups inserted"});
};