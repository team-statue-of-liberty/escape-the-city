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
let hammock;
let floaty;
let testEvent;
let testEvent2;
let testActivity1;
let testActivity2;
let testActivity3;
let attendeeList;

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
    beforeEach(() => dropCollection('gears'));

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
        return request  
            .post('/api/auth/signup')
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
        return save('gears', {
            item: 'hammock',
            description: 'Eno Double Nest 300lb capacity',
            quantity: 1,
            ownerId: testUser2._id
        }, token) 
            .then(data => {
                hammock = data;
                assert.equal(hammock, data);
            });
    });

    beforeEach(() => {
        return save('gears', {
            item: 'floaty',
            description: 'unicorn',
            quantity: 3,
            ownerId: testUser._id
        }, token) 
            .then(data => {
                floaty = data;
                assert.equal(floaty, data);
            });
    });


    beforeEach(() => {
        return save('events', {
            description: 'fun in the sun at Lost Lake',
            where: 'Lost Lake',
            when: new Date(),
            groupSize: 8,
            desiredGear: [{
                item: 'hammock'
            },
            {
                item: 'Kayak'
            }],
            attendees: [],
            ownerId: testUser._id
        }, token2)
            .then(data => testEvent = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Lets go to hot springs!',
            where: 'Hot spring place',
            when: new Date('2018-10-10'),
            groupSize: 5,
            desiredGear: [{
                item: 'Food'
            }],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent2 = data);
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

    beforeEach(() => {
        return save('activities', {
            name: 'swimming',
            description: 'splash splash splash',
            eventId: testEvent2._id,
            indoor: true
        }, token)
            .then(data => {
                testActivity3 = data;
                assert.equal(testActivity3.name, 'swimming');
            });
    });

    /* **********TESTS************* */
    it('saves an event to the database', () => {
        assert.isOk(testEvent._id);
    });

    it('gets all events at once', () => {
        return request
            .get('/api/events')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [testEvent2, testEvent]);
            });
    });

    it('gets one event by id, populating with correct data', () => {
        return request
            .get(`/api/events/${testEvent._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.invitees);
                assert.isDefined(body.activities);
                assert.equal(body.activities.length, 2);
                assert.deepEqual(body.activities[0], makeSimpleActivity(testActivity1));
                assert.deepEqual(body.activities[1], makeSimpleActivity(testActivity2));
                assert.deepEqual(body.desiredGear, testEvent.desiredGear);
                assert.equal(body.ownerId.email, 'justin@email.com');
            });
    });

    it('gets events by gear', () => {
        return request
            .get(`/api/events/match/${testUser2._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [testEvent]);
            });
    });

    it('gets events by activity', () => {
        return request
            .get('/api/events/swimming')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [testEvent, testEvent2]);
            });
    });

    it('allows users to edit own posts', () => {
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

    it('does not allow the non user to edit posts', () => {
        testEvent.description = 'THE BEST EVER';
        return request
            .put(`/api/events/${testEvent._id}`)
            .set('Authorization', token2)
            .send(testEvent)
            .then(({ body }) => {
                assert.equal(body.error, 'Invalid user');
                assert.notEqual(body.description, testEvent.description);
            });
    });

    //discuss with group about delete functionality and how it should work
    it('will not delete if user did not create the event', () => {
        return request
            .delete(`/api/events/${testEvent._id}`)
            .set('Authorization', token2)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });

    it('allows users to delete events', () => {
        return request
            .delete(`/api/events/${testEvent._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });

    it.only('adds a user to the event attendee list', () => {
        return request
            .post(`/api/events/${testEvent._id}/attendees`)
            .set('Authorization', token)
            .send(testUser2._id)
            .then(({ body }) => {
                assert.equal(body.attendees.length, 1);
                assert.equal(body.attendees[0], testUser2._id);
            });
    });

});