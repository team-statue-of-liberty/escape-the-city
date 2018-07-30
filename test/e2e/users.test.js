const { assert } = require('chai');
const request = require('./request');
// const { dropCollection  } = require('./_db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe('Users API', () => {

    // beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'hello@test.com',
                firsName: 'Bob',
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up the user', () => {
        assert.isDefined(token);
    });
});