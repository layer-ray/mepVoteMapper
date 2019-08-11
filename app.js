const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {errorLogger, clientErrorHandler,
    generalErrorHandler} = require('./components/errors/common');
    
const mepRoutes = require('./components/meps/mepRoutes');
const rcvRoutes = require('./components/rcvs/rcvRoutes');
const textRoutes = require('./components/texts/textRoutes');
const groupRoutes = require('./components/groups/groupRoutes');
const adminRoutes = require('./components/admin/adminRoutes');

const whitelist = [ "https://mep-vote-mapper.herokuapp.com", 
                    "https://check-the-vote.herokuapp.com"];
app.use(cors({
    origin: function(origin, cb) {
        whitelist.indexOf(origin) !== -1
            ? cb(null, true)
            : cb(new Error('CORS do not allow request from ' + origin))
    }
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use('/mep', mepRoutes);
app.use('/rcv', rcvRoutes);
app.use('/text', textRoutes);
app.use('/group', groupRoutes);
app.use(adminRoutes);

app.get('/', (req, res) => {
    res.send('You hit the main route');
});

app.use(errorLogger);
app.use(clientErrorHandler);
app.use(generalErrorHandler);

module.exports = app;