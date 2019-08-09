exports.initDAO = function InitDAO(opts){

    let conn;
    const db = opts.db || 'eu_9th-lg';
    const collection = opts.collection || 'admin';
    if(!opts.conn) {
        const errMsg = typeof(opts.conn) === 'undefined'
                        ? 'Connection not provided'
                        : 'Database not connected'
            throw new Error(errMsg);
    } else {
        conn = opts.conn;
    };

    const coll = conn.db(db).collection(collection);

    return ({coll});
};