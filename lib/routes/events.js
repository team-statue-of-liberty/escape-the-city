const router = require('express').Router();
const Event = require('../models/event');
// const { HttpError } = require('../utils/errors');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

// const getCredentials = body => {
//     const { email, password } = body;
//     delete body.password;
//     return { email, password };
// };

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        Event.create(req.body)
            .then(event => res.json(event))
            .catch(next);
    });