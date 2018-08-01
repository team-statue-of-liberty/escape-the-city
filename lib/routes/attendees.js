const router = require('express').Router();
const Attendee = require('../models/attendee');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();

const make404 = id => new HttpError({
    code: 404,
    message: `No attendee with id ${id}`
});

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        Attendee.create(req.body)
            .then(attendee => res.json(attendee))
            .catch(next);
    });