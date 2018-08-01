const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

let token;
const user = {
    email: 'Chris@test.com',
    firstName: 'Chris',
    driver: false,
    password: 'pass123'
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
            .post('/api/auth/signup')
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
    it('signs up the user', () => {
        assert.isDefined(token);
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

});

