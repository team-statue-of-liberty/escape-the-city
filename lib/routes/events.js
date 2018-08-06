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

    // if you're going to use a help function like "respond",
    // you need to use it consistently on all routes
    .get('/top5', (req, res, next) => {
        Event.findTop5()
            .then(top5 => res.send(top5))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        // this route code highlights the difficulty in working with the data
        // model as you have it. Even so, a few things below you can do to 
        // improve
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
                if(!event) return next(make404(req.params.id));
                
                event.activities = activities;
                const items = event.desiredGear.map(gear => gear.item);

                return Gear.find({ item: { $in: items } })
                        .lean()
                        .select('ownerId')
                        .populate('ownerId', 'email firstName driver')
                        .then(gears => gears.map(gear => gear.ownerId))
                        .then(users => {
                            event.match = users;
                            return event;
                        });
                    })
                .then(event => res.json(event))
                .catch(next);
    })

    .get('/match/me', (req, res, next) => {
        // you can't trust req.params and req.body!
        Gear.find({ ownerId: req.user.id })
            .lean()
            .then(gear => {
                return Promise.all(
                    gear.map(_gear => {
                        return Event.find({ 'desiredGear.item':  _gear.item });
                    })
                )
                    .then((events) => {
                        return res.json(events);
                    });
            })
            .catch(next);
    })

    .get('/activity/:name', (req, res, next) => {
        Activity
            .find({ name: req.params.name })
            .select('eventId')
            .lean()
            .then(activities => activities.map(a => a.eventId)
            .then(eventIds => {
                return Event.find({ _id: { $in: eventIds } })
                    .lean()
                    //.select(?)
            .then(events => {
                return res.json(events);
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
            .select('ownerId')
            .lean()
            .then(event => {
                if(event.ownerId.toString() === req.user.id) {
                    Event.findByIdAndRemove(req.params.id)
                        .then(removed => res.json({ removed: !!removed }));
                }
                else {
                    // should be 403
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