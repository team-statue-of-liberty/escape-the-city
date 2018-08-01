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
                email: 'justice192@test.com',
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
                email: 'carter9@test.com',
                firstName: 'Carter',
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
                email: 'journey2934@test.com',
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
                email: 'lewis239@test.com',
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
                email: 'sue23439@test.com',
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
                email: 'joe49@test.com',
                firstName: 'Joe',
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
                email: 'antreo9@test.com',
                firstName: 'Antreo',
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
                email: 'brian9@test.com',
                firstName: 'Brian',
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
                email: 'carrie88@test.com',
                firstName: 'Carrie',
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
                email: 'kevin678@test.com',
                firstName: 'Kevin',
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
                email: 'mariah678@test.com',
                firstName: 'Mariah',
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
                email: 'sarah675@test.com',
                firstName: 'Sarah',
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
                email: 'easton55@test.com',
                firstName: 'Easton',
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
                email: 'mark55@test.com',
                firstName: 'Mark',
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
                email: 'robyn55@test.com',
                firstName: 'Robyn',
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
                email: 'andrew33@test.com',
                firstName: 'Andrew',
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
                email: 'arthur33@test.com',
                firstName: 'Arthur',
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
                email: 'carmen334@test.com',
                firstName: 'Carmen',
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
                email: 'hen314@test.com',
                firstName: 'Injoong',
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
                email: 'mario345@test.com',
                firstName: 'Mario',
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
                email: 'bobby45354@test.com',
                firstName: 'Robert',
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
                email: 'ryanL345@test.com',
                firstName: 'RyanL',
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
                email: 'marty34@test.com',
                firstName: 'Marty',
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
                email: 'elizabeth3453@test.com',
                firstName: 'Elizabeth',
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
                email: 'tasha345@test.com',
                firstName: 'Tasha',
                driver: true,
                password: 'pass123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    /* ************TESTS************ */
    it.only('signs up the user', () => {
        assert.isDefined(token);
    });

    it('signs in a user', () => {
        return request
            .post('/api/users/signin')
            .send({
                email: 'joe4@test.com',
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