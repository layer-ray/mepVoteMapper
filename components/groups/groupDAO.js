const {initDAO} = require('../initDAO');

function GroupModel(opts){
    const {coll: groupColl} = initDAO(opts);

    return {
            insertGroups: async groups => {
                await groupColl.drop();
                return await groupColl.insertMany(groups);        
            },
            getGroups: async () => {
                let cursor = await groupColl.find().sort({LtR: 1});
                return cursor.toArray();
            }
    };
};

module.exports = GroupModel;