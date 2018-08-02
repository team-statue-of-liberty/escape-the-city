const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

let token;
let token2;

const user = {
    email: 'Chris@test.com',
    firstName: 'Chris',
    driver: false,
    password: 'pass123'
};
const user2 = {
    email: 'Mariah@test.com',
    firstName: 'Mariah',
    driver: false,
    password: 'abc123'
};

describe('Users API', () => {
    
    beforeEach(() => dropCollection('users'));
    
    beforeEach(() => {
        return request  
            .post('/api/auth/signup')
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                verify(token)
                    .then((body) => {
                        user._id = body.id;
                    });
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/auth/signup')
            .send(user2)
            .then(checkOk)
            .then(({ body }) => {
                token2 = body.token;
                verify(token2)
                    .then((body) => {
                        user2._id = body.id;
                    });
            });
    });

    it('signs up the user', () => {
        assert.isDefined(token);
    });

    it('gets a user by id', () => {
        return request
            .get(`/api/users/${user._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.firstName, user.firstName);
                assert.equal(body.driver, false);
                assert.isUndefined(body.password);
                assert.isUndefined(body.hash);
            });
    });

    it('allows user to update their profile', () => {
        user.driver = true;
        return request
            .put(`/api/users/${user._id}`)
            .set('Authorization', token)
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.driver, true);
            });
    });

    it('allows a user to delete their profile', () => {
        return request
            .delete(`/api/users/${user._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
    it.only('does not allow a user to delete another profile', () => {
        return request
            .delete(`/api/users/${user._id}`)
            .set('Authorization', token2)
            .then(({ body }) => {
                assert.deepEqual(body, { error: 'Unauthorized' });
            });
    });
});

