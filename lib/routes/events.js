const router = require('express').Router();
const Event = require('../models/event');
const Activity = require('../models/activity');
const { HttpError } = require('../utils/errors');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

// const getCredentials = body => {
//     const { email, password } = body;
//     delete body.password;
//     return { email, password };
// };

const make404 = id => new HttpError({
    code: 404,
    message: `No film with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Event.find()
            .lean()
            .then(events => res.json(events))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Event.findById(req.params.id)
                .lean()
                .select('-__v')
                .populate('createdBy', 'email'),
            Activity.find({ eventId: req.params.id })
                .lean()
                .select('name description indoor')
        ])
            .then(([event, activities]) => {
                if(!event) next(make404(req.params.id));
                else {
                    event.activities = activities;
                    res.json(event);
                }
            })
    })
    .post('/', ensureAuth, (req, res, next) => {
        Event.create(req.body)
            .then(event => res.json(event))
            .catch(next);
    });