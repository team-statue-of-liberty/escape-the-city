const express = require('express');
const app = express();
const morgan = require('morgan');

const path = require('path');
const publicDir = path.resolve(__dirname, '../public');

app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.json());

const users = require('./routes/users');
const events = require('./routes/events');
const gears = require('./routes/gears');

app.use('/api/users', users);
app.use('/api/events', events);
app.use('/api/gears', gears);

const { handler, api404 } = require('./utils/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});

//error handler goes last
//eslint-disable-next-line
app.use(handler);

module.exports = app;