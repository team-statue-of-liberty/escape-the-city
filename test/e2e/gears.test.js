const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
// const { Types } = require('mongoose');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

let token;
let floaty;

const save = (path, data, token = null) => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

const testUser = {
    email: 'justin@email.com',
    password: 'justin123',
    firstName: 'Justin',
    driver: true
};

describe.only('Gears API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('gears'));

    beforeEach(() => {
        return request  
            .post('/api/users/signup')
            .send(testUser)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                verify(token)
                    .then((body) => {
                        testUser._id = body.id;
                    });
            });
    });

    beforeEach(() => {
        return save('gears', {
            item: 'floaty',
            description: 'unicorn',
            quantity: 3,
            user: testUser._id
        }, token) 
            .then(data => floaty = data);
    });

    it('saves a gear item', () => {
        assert.isDefined(floaty);
    });


});