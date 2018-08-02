const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        if(!req.body._id) {
            console.log(req.route);
            console.log('***NO REQ.BODY.ID***');
            console.log('***REQ.USER.ID***', req.user.id);
            console.log('***REQ.PARAMS.ID***', req.params.id);
            if(req.user.id !== req.params.id) {
                next(new HttpError({
                    code: 403,
                    message: 'Unauthorized'
                }));
            }
        }
        if(req.body._id){
            console.log('***REQ.BODY.ID***');
            console.log('***REQ.USER.ID***', req.user.id);
            console.log('***REQ.BODY.OWNERID***', req.body.ownerId);
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

