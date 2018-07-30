require('dotenv').config();
const { createServer } = require('http');
const app = require('./lib/app');
// const connect = require('./lib/utils/connect');

// connect();

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
    console.log('server running on', server.address().port);
});