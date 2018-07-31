const router = require('express').Router();
const Event = require('../models/event');
const Activity = require('../models/activity');
const Gear = require('../models/gear');
const { HttpError } = require('../utils/errors');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();
const ensureSelf = require('../utils/ensure-self')();
const ensureAdmin = require('../utils/ensure-role')('admin');


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
            .sort({ when: 'desc' })
            .then(events => res.json(events))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Event.findById(req.params.id)
                .lean()
                .select('-__v')
                .populate('ownerId', 'email'),
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
            });
    })
    .get('/match/:userid', (req, res, next) => {
        Gear.find({ ownerId: req.params.id })
            .lean()
            .then(gear => {
                return Promise.all(
                    gear.map(_gear => {
                        return Event.find({ 'desiredGear.item':  _gear.item });
                    })
                )
                    .then(([events]) => {
                        return res.json(events);
                    });
            })
            .catch(next);
    })
    .get('/activity/:activity', (req, res, next) => {
        Activity.find({ name: req.params.activity })
            .lean()
            .then(activities => {
                return Promise.all(
                    activities.map(activity => {
                        return Event.findById(activity.eventId)
                            .lean()
                            .then(event => event);
                    })
                )
                    .then(events => {
                        return res.json(events);
                    });
            })
            .catch(next);
    })
    .put('/:id', ensureAuth, ensureAdmin, ensureSelf, (req, res, next) => {
        Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            })
            .then(event => {
                if(!event) next(make404(req.params.id));
                else res.json(event);
            });
    })
    .delete('/:id', ensureAuth, ensureAdmin, (req, res) => {
        Promise.all([
            Event.findById(req.params.id)
                .lean(),
            Activity.find({ eventId: req.params.id })
                .lean()
        ])
            .then(([event, activities]) => {
                if(activities.length) res.json({ removed: false });
                else {
                    Event.findByIdAndDelete(event._id)
                        .then(() => res.json({ removed: true }));
                }
            });
    })
    .post('/', ensureAuth, (req, res, next) => {
        Event.create(req.body)
            .then(event => res.json(event))
            .catch(next);
    });