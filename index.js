const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const {openDbConn} = require('./db');

const port = process.env.PORT || 3000;

openDbConn()
    .then( () => {
        const app = require('./app');

        http
            .createServer(app)
            .listen(port, () => console.log(`server up at ${port}`));
    })
    .catch(err => {
        console.error('server error - shutdown');
        console.error(err);
        process.exit(1);
    });
    
process.on('unhandledRejection', err => {
    console.log('unhandledRejection caught!');
    console.error('server error - shutdown');
    console.error(err);
    process.exit(1);
});

process.on('uncaughtException', err => {
    console.log('uncaughtException caught!');
    console.error('server error - shutdown');
    console.error(err);
    process.exit(1);
});