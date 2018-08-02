const router = require('express').Router();
const User = require('../models/user');
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

