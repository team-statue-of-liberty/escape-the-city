const chai = require('chai');
const { assert } = chai;
const UserModel = require('../../lib/models/user');
const { getErrors } = require('./helpers');

describe('UserModel model', () => {

    it('validates good model', () => {
        const data = {
            email: 'me@test.com',
            password: 'secrit123',
            firstName: 'Bobby',
            driver: true
        };
        const userModel = new UserModel(data);

        userModel.generateHash(data.password);
        
        assert.deepEqual(userModel.email, data.email);
        assert.isUndefined(userModel.validateSync());
    });

    it('required fields are filled in', () => {
        const userModel = new UserModel({});
        const errors = getErrors(userModel.validateSync(), 4);
    
        assert.equal(errors.firstName.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
});