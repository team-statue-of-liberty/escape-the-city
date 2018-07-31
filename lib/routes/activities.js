const router = require('express').Router();
const Activity = require('../models/activity');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        Activity.create(req.body)
            .then(activity => res.json(activity))
            .catch(next);
    })
    .put('/:id', ensureAuth, (req, res, next) => {
        Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true 
            }
        )
            .then(activity => res.json(activity))
            .catch(next);
    })
    .delete('/:id', ensureAuth, (req, res, next) => {
        Activity.findByIdAndRemove(req.params.id)
            .then(activity => res.json({ removed: !!activity }))
            .catch(next);
    });