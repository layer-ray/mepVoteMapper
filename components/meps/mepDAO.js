const {initDAO} = require('../initDAO');

function MEPModel(opts){
    const {coll: mepColl} = initDAO(opts);
    return {
        insertMeps: async mepsArr => {
            await mepColl.drop();
            return await mepColl.insertMany(mepsArr);
        },
        getMeps: async (page, resPerPage) => {
            let cursor;
            if (page === -1) {
                cursor = await mepColl.find();
            } else {
                cursor = await mepColl.find().skip(page*resPerPage) .limit(resPerPage);
            };
            
            return cursor.toArray();
        },
        getMatchingLastNames: async(lastName) => {
            // case sensitive search should be preferred instead of
            // case insensitive for performance reason
            // some lastnames (e.g. de GRAAFF) has different case so
            // check is made against voteName (all lowercase)
           const cursor = await mepColl.find({voteName: {$regex : lastName.toLowerCase()}});
            return cursor.toArray();
        },
        getMepsSortedByGroup: async() => {
            const pipeline = [
                {$match: {
                    voteName: {$exists: true}
                }},
                {$project: {
                    persId: 1,
                    fullName: 1,
                    voteName: 1,
                    countryLabel: 1,
                    politicalGroupLabel: 1,
                    nationalPoliticalGroupLabel: 1
                }},
                {$lookup: {
                    from: 'groups',
                    localField: 'politicalGroupLabel',
                    foreignField: 'name',
                    as: 'group_info'
                }},
                {$sort: {
                    "group_info.LtR": -1, 
                    nationalPoliticalGroupLabel: 1,
                }}
            ];
            
            return await mepColl.aggregate(pipeline).toArray();
        },
        getGroups: async () => {
            const pipeline = [
                {$match: {
                    politicalGroupLabel: {$exists: true}
                }},
                {$group: {
                    _id: "$politicalGroupLabel"
                }}
            ];
            
            return await mepColl.aggregate(pipeline).toArray();
        }
    };
};

module.exports = MEPModel;