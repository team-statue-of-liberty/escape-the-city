const chai = require('chai');
const { assert } = chai;
const UserModel = require('../../lib/models/user');
// const { getErrors } = require('./helpers');

describe('UserModel model', () => {

    it('validates good model', () => {
        const data = {
            email: 'me@test.com',
            password: 'secrit123',
            firstName: 'Bobby'
        };
        const userModel = new UserModel(data);

        assert.deepEqual(userModel.email, data.email);
        assert.isUndefined(userModel.password, 'password should be gone');
    });

});