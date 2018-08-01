const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../utils/errors');
const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router

