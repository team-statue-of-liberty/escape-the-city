const router = require('express').Router();
const User = require('../models/user');
const Gear = require('../models/gear');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();
const ensureSelf = require('../utils/ensure-self')();

const make404 = id => new HttpError({
    code: 404,
    message: `No user with id ${id}`
});

module.exports = router
    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .select('driver email firstName')
            .then(user => res.json(user))
            .catch(next);
    })

    .get('/:id/gear', (req, res, next) => {
        Gear.find({ ownerId: req.params.id })
            .lean()
            .select('-__v')
            .then(gear => res.json(gear))
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            })
            .then(user => {
                if(!user) next(make404(req.params.id));
                else res.json(user);
            });
    })
    
    // Do you really need to delete a user? Don't do work you don't need...
    .delete('/:id', ensureAuth, ensureSelf, (req, res, next) => {
        // In order to allow a user to be deleted, you need to 
        // check they are not the owner of anything.
        User.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed: !!removed }))
            .catch(next);
    });

