const router = require('express').Router();
const Gear = require('../models/gear');
// const { HttpError } = require('../utils/errors');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

module.exports = router 
    .get('/', (req, res, next) => {
        Gear.find()
            .lean()
            .then(gears => res.json(gears))
            .catch(next);
    })

    .post('/', ensureAuth, (req, res, next) => {
        Gear.create(req.body)
            .then(gear => res.json(gear))
            .catch(next);
    });