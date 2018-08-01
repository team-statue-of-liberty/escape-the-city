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
    });

