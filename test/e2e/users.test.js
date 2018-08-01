const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe('Users API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'justice@test.com',
                firstName: 'Justice',
                driver: false,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'carrie@test.com',
                firstName: 'Carrie',
                driver: false,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'journey@test.com',
                firstName: 'Journey',
                driver: false,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'lewis@test.com',
                firstName: 'Lewis',
                driver: false,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'sue@test.com',
                firstName: 'Sue',
                driver: true,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send({
                email: 'joe@test.com',
                firstName: 'Joe',
                driver: true,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it.only('signs up the user', () => {
        assert.isDefined(token);
    });

    it('signs in a user', () => {
        return request
            .post('/api/users/signin')
            .send({
                email: 'hello3@test.com',
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('verifies a token', () => {
        return request
            .get('/api/users/verify')
            .set('Authorization', token)
            .then(checkOk);
    });
});