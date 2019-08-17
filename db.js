const {MongoClient} = require('mongodb');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@layer-free-cluster-ewzsw.mongodb.net/test?retryWrites=true&w=majority`;
const adminUrl = `mongodb+srv://${process.env.DB_ADMIN_USER}:${process.env.DB_ADMIN_PASSWORD}@layer-free-cluster-ewzsw.mongodb.net/test?retryWrites=true&w=majority`;

const _conn = new MongoClient(url, {useNewUrlParser: true});
const _authConn = new MongoClient(adminUrl, {useNewUrlParser: true});

exports.openDbConn = async function openDbConn () {
    try {
        await _conn.connect();
        console.log('connection successful');
        return _conn;
    } catch(err){
        console.error(err);
        return false;
    };
};

exports.getConn = () => _conn;

exports.createAuthConn = async function createAuthConn() {
    try {
        await _authConn.connect();
        console.log('welcome mr.admin');
        return _authConn;
    } catch(err) {
        console.error(err);
        return false;
    };
};

// security concerns?
exports.getAuthConn = () => _authConn;

exports.AuthLogout = () => _authConn.close();