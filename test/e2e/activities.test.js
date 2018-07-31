const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { verify } = require('../../lib/utils/token-service');
// const { Types } = require('mongoose');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

let token;
let testEvent;
let testActivity;

const save = (path, data, token = null) => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

const testUser = {
    email: 'mariah@email.com',
    password: 'mariah123',
    firstName: 'Mariah',
    driver: true
};

describe('Activities API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('activities'));
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

    beforeEach(() => {
        return save('activities', {
            name: 'golfing',
            description: '18-hole round',
            eventId: testEvent._id,
            indoor: false
        }, token)
            .then(data => {
                testActivity = data;
            });
    });

    it('saves an activity', () => {
        assert.isOk(testActivity._id);
    });

    // TODO: put
    it('updates an activity', () => {
        testActivity.price = 'free';
        return request
            .put(`/api/activities/${testActivity._id}`)
            .set('Authorization', token)
            .then(testActivity)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, testActivity);
            });
    });

    // TODO: delete 
});