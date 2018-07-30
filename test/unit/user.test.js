const chai = require('chai');
const { assert } = chai;
const UserModel = require('../../lib/models/user');
const { getErrors } = require('./helpers');

describe.only('UserModel model', () => {

    it('validates good model', () => {
        const data = {
            email: 'me@test.com',
            password: 'secrit123',
            firstName: 'Bobby',
            driver: true
        };
        const userModel = new UserModel(data);

        assert.deepEqual(userModel.email, data.email);
        assert.isUndefined(userModel.password, 'password should be gone');

        userModel.generateHash(data.password);
        assert.isDefined(userModel.hash, 'has exists');
        assert.notEqual(userModel.hash, data.password, 'has and pass different');

        assert.isUndefined(userModel.validateSync());

        assert.isTrue(userModel.comparePassword(data.password), 'compare a good password');
        assert.isFalse(userModel.comparePassword('123abc'), 'compare a bad password');
    });

    it('required fields are filled in', () => {
        const userModel = new UserModel({});

        const errors = getErrors(userModel.validateSync(), 4);

        assert.equal(errors.firstName.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
});