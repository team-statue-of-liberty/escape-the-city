const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

const makeSimpleActivity = (activity) => {
    const simple = {
        _id: activity._id,
        name: activity.name,
        description: activity.description,
        indoor: activity.indoor
    };

    return simple;
};

let token;
let token2;
let testEvent;
let testActivity1;
let testActivity2;

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
    driver: true,
    roles: ['admin']
};

const testUser2 = {
    email: 'bobby@email.com',
    password: 'secretPASS',
    firstName: 'Bobby',
    driver: false,
    roles: ['user']
};


describe('Events API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('events'));
    beforeEach(() => dropCollection('activities'));

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
        return request  
            .post('/api/users/signup')
            .send(testUser2)
            .then(checkOk)
            .then(({ body }) => {
                token2 = body.token;
                verify(token2)
                    .then((body) => {
                        testUser2._id = body.id;
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
                testActivity1 = data;
            });
    });

    beforeEach(() => {
        return save('activities', {
            name: 'swimming',
            description: 'splashy time',
            eventId: testEvent._id,
            indoor: false
        }, token)
            .then(data => {
                testActivity2 = data;
            });
    });

    it('saves an event to the database', () => {
        assert.isOk(testEvent._id);
    });

    it('gets all events at once', () => {
        return request
            .get('/api/events')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [testEvent]);
            });
    });

    it('gets one event by id, populating with correct data', () => {
        return request
            .get(`/api/events/${testEvent._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.activities);
                assert.equal(body.activities.length, 2);
                assert.deepEqual(body.activities[0], makeSimpleActivity(testActivity1));
                assert.deepEqual(body.activities[1], makeSimpleActivity(testActivity2));
                assert.deepEqual(body.desiredGear, testEvent.desiredGear);
                assert.equal(body.createdBy.email, 'justin@email.com');
            });
    });

    it('gets events by activity', () => {
        return request
            .get('/api/events/activity/swimming')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, testEvent);
            });
    });

    it('allows admins to edit posts', () => {
        testEvent.description = 'ultra super duper fun';
        return request
            .put(`/api/events/${testEvent._id}`)
            .set('Authorization', token)
            .send(testEvent)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.description, testEvent.description);
            });
    });

    it('does not allow non-admins to edit posts', () => {
        testEvent.description = 'THE BEST EVER';
        return request
            .put(`/api/events/${testEvent._id}`)
            .set('Authorization', token2)
            .send(testEvent)
            .then(({ body }) => {
                assert.equal(body.error, 'Must be an admin to do that');
                assert.notEqual(body.description, testEvent.description);
            });
    });

    //discuss with group about delete functionality and how it should work
    it('will not delete if there are activities associated with event', () => {
        return request
            .delete(`/api/events/${testEvent._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });

});