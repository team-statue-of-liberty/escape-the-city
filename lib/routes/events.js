const router = require('express').Router();
const Event = require('../models/event');
const Activity = require('../models/activity');
const Gear = require('../models/gear');
const { respond } = require('./route-helpers');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();
const ensureSelf = require('../utils/ensure-self')();
// const ensureAdmin = require('../utils/ensure-role')('admin');


const make404 = id => new HttpError({
    code: 404,
    message: `No events with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Event.find()
            .lean()
            .sort({ when: 'desc' })
            .then(events => res.json(events))
            .catch(next);
    })

    .get('/top5', respond(() => Event.findTop5()))

    .get('/:id', (req, res, next) => {
        return Promise.all([
            Event.findById(req.params.id)
                .lean()
                .select('-__v')
                .populate('ownerId', 'email')
                .populate('attendees', 'firstName email'),
            Activity.find({ eventId: req.params.id })
                .lean()
                .select('name description indoor')
        ])
            .then(([event, activities]) => {
                Promise.all(
                    event.desiredGear.map(gear => {
                        return Gear.find({ item: gear.item })
                            .lean()
                            .select('ownerId')
                            .populate('ownerId', 'email firstName driver');
                    })
                )
                    .then((users) => {
                        event.match = users;
                        res.json(event);
                    })
                    .catch(next);
                if(!event) next(make404(req.params.id));
                else {
                    event.activities = activities;
                }
            });
    })

    .get('/match/:userid', (req, res, next) => {
        Gear.find({ ownerId: req.params.userid })
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

    .get('/activity/:name', (req, res, next) => {
        Activity.find({ name: req.params.name })
            .lean()
            .then(activities => {
                return Promise.all(
                    activities.map(_activity => {
                        return Event.findById(_activity.eventId)
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

    .put('/:id', ensureAuth, ensureSelf, (req, res, next) => {
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

    .delete('/:id', ensureAuth, (req, res) => {
        Event.findById(req.params.id)
            .lean()
            .then(event => {
                if(event.ownerId.toString() === req.user.id) {
                    Event.findByIdAndRemove(req.params.id)
                        .then(removed => res.json({ removed: !!removed }));
                }
                else {
                    res.json({ removed: false });
                }
            });
    })

    .post('/', ensureAuth, (req, res, next) => {
        Event.create(req.body)
            .then(event => res.json(event))
            .catch(next);
    })
    
    .post('/:id/attendees', ensureAuth, (req, res, next) => {
        Event.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    attendees: req.body._id
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .then(event => {
                if(!event) {
                    next(make404(req.params.id));
                }
                else {
                    res.json(event);
                }
            })
            .catch(next);
    });