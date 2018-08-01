const chai = require('chai');
const { assert } = chai;
const UserModel = require('../../lib/models/user');

describe('Auth', () => {

    it('validates good model', () => {
        const data = {
            email: 'me@test.com',
            password: 'secrit123',
            firstName: 'Bobby',
            driver: true
        };
        const userModel = new UserModel(data);

       
        assert.isUndefined(userModel.password, 'password should be gone');
        userModel.generateHash(data.password);
        assert.isDefined(userModel.hash, 'has exists');
        assert.notEqual(userModel.hash, data.password, 'has and pass different');
        assert.isTrue(userModel.comparePassword(data.password), 'compare a good password');
        assert.isFalse(userModel.comparePassword('123abc'), 'compare a bad password');
    });
});