const router = require('express').Router();
const Gear = require('../models/gear');
const { HttpError } = require('../utils/errors');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();
const ensureSelf = require('../utils/ensure-self')();

const make404 = id => new HttpError({
    code: 404,
    message: `No gear with id ${id}`
});

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
    })

    .get('/:id', (req, res, next) => {
        Gear.find({ ownerId: req.params.id })
            .lean()
            .select('-__v')
            .then(gear => res.json(gear))
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureSelf, (req, res, next) => {
        Gear.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            })
            .then(gear => {
                if(!gear) next(make404(req.params.id));
                else res.json(gear);
            });
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Gear.findByIdAndDelete(req.params.id)
            .then(() => res.json({ removed: true }))
            .catch(next);
    });

    