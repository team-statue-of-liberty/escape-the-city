const chai = require('chai');
const { assert } = chai;
const UserModel = require('../../lib/models/your-model');
// const { getErrors } = require('./helpers');

describe('UserModel model', () => {

    it('validates good model', () => {
        const data = {
            // example full, good data
        };
        const userModel = new UserModel(data);

        const json = userModel.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(userModel.validateSync());
    });

});