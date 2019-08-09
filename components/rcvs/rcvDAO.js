const ObjectID = require('mongodb').ObjectID;
const {initDAO} = require('../initDAO');

function RCVModel(opts){
    const {coll: rcvColl} = initDAO(opts);
    
    return {
        getInsertedFiles: async () => {
            let filesCursor = await rcvColl.aggregate([
                                        {$group: {
                                                _id: "$filename",
                                                rcvs: { $sum: 1}
                                        }}
                                    ]);
            return filesCursor.toArray();
        },
        insertRcvs: async rcvs => {
            return await rcvColl.insertMany(rcvs);
        },
        removeAllRcvs: async () => {
            return await rcvColl.deleteMany({});
        },
        getRcvs: async (page, resPerPage) => {
            let cursor;
            if (page === -1) {
                cursor = await rcvColl.find();
            } else {
                cursor = await rcvColl.find().skip(page*resPerPage) .limit(resPerPage);
            };
            
            return cursor.toArray();
        },
        getMinutesCodes: async () => {
            let minuteCursor = await rcvColl.aggregate([
                {
                    $match: {ABNumber: {$exists: true}}
                },
                {
                    $group: {
                        _id: "$ABNumber",
                        count: {$sum: 1}
                    }
                }
            ]);
            return minuteCursor.toArray();
        },
        getVotationsByCode: async code => {
            let votationsCursor = await rcvColl.find({ABNumber: code})
                                                .project({favour: 0, against: 0, abstention: 0});
            return votationsCursor.toArray();
        },
        getVotationById: async id => {
            return await rcvColl.findOne({_id: ObjectID(id)});
        },
        getVotationsByDates: async dates => {
            const {from, to} = dates;
            const votations = await rcvColl.aggregate([
                {
                    $match: {
                        date:{$gte: new Date(from), $lte: new Date(to)}
                    }
                },
                {
                    $lookup: {
                        from: "texts",
                        localField: "ABNumber",
                        foreignField: "ABNumber",
                        as: "code"
                    }
                },
                {
                    $unwind: "$code"
                },
                {
                    $group: {
                        _id: "$code.ABNumber",
                        title: {$first: "$code.title"},
                        rcvs: {$push: {type: "$type", ABNumber: "$ABNumber", _id: "$_id", title: "$title"}}
                    }
                }
            ]);

            return votations.toArray();
        },
    }
};


module.exports = RCVModel;