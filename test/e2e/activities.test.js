const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

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
            .post('/api/auth/signup')
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
            ownerId: testUser._id
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
                delete testActivity.__v;
            });
    });

    it('saves an activity on POST', () => {
        assert.isOk(testActivity._id);
    });

    it('updates an activity on PUT', () => {
        testActivity.name = 'Putt putt';
        return request
            .put(`/api/activities/${testActivity._id}`)
            .set('Authorization', token)
            .send(testActivity)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, testActivity);
            });
    });

    it('removes an activity on DELETE', () => {
        return request 
            .delete(`/api/activities/${testActivity._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});