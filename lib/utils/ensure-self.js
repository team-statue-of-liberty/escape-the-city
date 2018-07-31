const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        console.log('******CONSOLE********', req);
        if(!(req.user.id === req.body.ownerId)) {
            next(new HttpError({
                code: 403,
                message: 'Invalid'
            }));
        }

        next();
    };
};
