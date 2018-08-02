const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        if(!req.body._id) {
            if(req.user.id !== req.params.id) {
                next(new HttpError({
                    code: 403,
                    message: 'Unauthorized'
                }));
            }
        }
        if(req.body._id){
            if(!(req.user.id === req.body.ownerId)) {
                next(new HttpError({
                    code: 403,
                    message: 'Invalid user'
                }));
            }
        }

        next();
    };
};

