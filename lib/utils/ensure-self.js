const { HttpError } = require('./errors');

// the logic here is confusing, and I don't think it is 
// doing what you think...
module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        // req.body is completely under the callers control, so
        // is not trustable
        if(!req.body._id) {
            if(req.user.id !== req.params.id) {
                next(new HttpError({
                    code: 403,
                    message: 'Unauthorized'
                }));
            }
        }
        if(req.body._id){
            // What if they put their id in the "ownerId" property of the body?
            // security bypass!
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

