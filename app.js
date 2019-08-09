const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {errorLogger, clientErrorHandler,
    generalErrorHandler} = require('./components/errors/common');

const mepRoutes = require('./components/meps/mepRoutes');
const rcvRoutes = require('./components/rcvs/rcvRoutes');
const textRoutes = require('./components/texts/textRoutes');
const groupRoutes = require('./components/groups/groupRoutes');
const adminRoutes = require('./components/admin/adminRoutes');
    
app.use(cors());
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