const router = require('express').Router();
const User = require('../models/user');
const Gear = require('../models/gear');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();


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
    .delete('/:id', ensureAuth, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .then(user => {
                if(user._id.toString() === req.user.id) {
                    User.findByIdAndRemove(req.params.id)
                        .then(removed => res.json({ removed: !!removed }));
                }
                else {
                    res.json({ removed: false });
                }
            })
            .catch(next);
    });

