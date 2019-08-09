const {initDAO} = require('../initDAO');

function TextModel(opts) {
    const {coll: textColl} = initDAO(opts);

    return {
        insertTexts: async textArray => {
            await textColl.deleteMany({});
            return await textColl.insertMany(textArray);
        },
        getTexts: async (page, resPerPage) => {
            let cursor;
            if(page === -1) {
                cursor = await textColl.find();
            } else {
                cursor = await textColl.find()
                                        .skip(resPerPage * page)
                                        .limit(resPerPage);
            };

            return cursor.toArray();
        },
        getVotationsByTextTitleWord: async words => {
            if(!words) return [];

            const pipeline = [
                {
                    $match: {
                        $text: {$search: words}
                    }
                },
                {
                    $group: {
                        _id: "$ABNumber",
                        title: {$first: "$title"},
                    }
                },
                {
                    $lookup: {
                        from: 'rcvs',
                        let: {code: '$_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$ABNumber", "$$code" 
                                        ]
                                    }
                                }
                            },
                            {   
                                $project: {
                                    type: 1, ABNumber: 1, title: 1
                                }
                            }],
                        as: 'rcvs'
                    }
                },
            ];

            const cursor = await textColl.aggregate(pipeline);
            return cursor.toArray();
        }
    };
};

module.exports = TextModel;