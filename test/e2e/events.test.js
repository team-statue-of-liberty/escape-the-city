const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};


let token;
let testEvent;

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


describe.only('Events API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('events'));

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
        return save('events', {
            description: 'fun in the sun at Lost Lake',
            where: 'Lost Lake',
            when: new Date(),
            groupSize: 8,
            desiredGear: [{
                item: 'Cornhole'
            },
            {
                item: 'Kayak'
            }],
            createdBy: testUser._id
        }, token)
            .then(data => testEvent = data);
    });

    it('saves an event to the database', () => {
        assert.isOk(testEvent._id);
    });

});