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
let testEvent3;
let testEvent4;
let testEvent5;
let testEvent6;
let testEvent7;
let testActivity1;
let testActivity2;
let testActivity3;

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
            desiredGear: [
                {
                    item: 'Food'
                }

            ],
            attendees: [testUser._id],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent2 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Silver Star Hike',
            where: 'Silver Star Mountain Washington',
            when: new Date('2018-11-10'),
            groupSize: 8,
            desiredGear: [
                {
                    item: 'binoculars'
                },
                {
                    item: 'camp chairs'
                },
                {
                    item: 'gps'
                },
                {
                    item: 'cooler'
                },
                {
                    item: 'sleeping bag'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent3 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Surf day on the coast',
            where: 'Oswald West',
            when: new Date('2018-07-04'),
            groupSize: 4,
            desiredGear: [
                {
                    item: 'firewood'
                },
                {
                    item: 'frisbee'
                },
                {
                    item: 'bodyboard'
                },
                {
                    item: 'wagon'
                },
                {
                    item: 'snorkel gear'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent4 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Timberline Trail thru-hike',
            where: 'Mt.Hood Oregon',
            when: new Date('2018-09-12'),
            groupSize: 4,
            desiredGear: [
                {
                    item: 'ultralight camp cook set'
                },
                {
                    item: 'sleeping bag'
                },
                {
                    item: 'water filter'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent5 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Cottonwood Canyon Cookout',
            where: 'Cottonwood Canyon State Park, OR',
            when: new Date('2018-10-12'),
            groupSize: 4,
            desiredGear: [
                {
                    item: 'lawn darts'
                },
                {
                    item: 'pie iron'
                },
                {
                    item: 'bocce ball set'
                },
                {
                    item: 'giant Jenga'
                },
                {
                    item: 'cooler'
                },
                {
                    item: 'SUP'
                },
                {
                    item: 'walkie-talkies'
                },
                {
                    item: 'EZ up tent'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent6 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Oregon Coast Adventure Weekend',
            where: 'Cannon Beach to Tillamook',
            when: new Date('2018-06-03'),
            groupSize: 8,
            desiredGear: [
                {
                    item: 'golf clubs'
                },
                {
                    item: 'hammock'
                },
                {
                    item: 'camp chairs'
                },
                {
                    item: 'frisbee'
                },
                {
                    item: 'beach umbrella'
                },
                {
                    item: 'wetsuit'
                },
                {
                    item: 'kayak'
                },
                {
                    item: 'bike'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent7 = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Detroit Lake Party',
            where: 'Detroit Lake Oregon',
            when: new Date('2018-08-10'),
            groupSize: 6,
            desiredGear: [
                {
                    item: 'soccerball'
                },
                {
                    item: 'floaty'
                },
                {
                    item: 'paddle board'
                },
                {
                    item: 'fishing rods'
                },
                {
                    item: 'water skis'
                },
                {
                    item: 'life jacket'
                },
                {
                    item: 'walkie-talkies'
                },
                {
                    item: 'SUP'
                }
            ],
            attendees: [],
            ownerId: testUser2._id
        }, token)
            .then(data => testEvent8 = data);
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
    it.only('saves an event to the database', () => {
        assert.isOk(testEvent._id);
    });

    it('gets all events at once', () => {
        return request
            .get('/api/events')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    testEvent2,
                    testEvent
                ]);
            });
    });

    it('gets one event by id, populating with correct data', () => {
        return request
            .get(`/api/events/${testEvent._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.match);
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
            .get('/api/events/activity/swimming')
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

    it('adds a user to the event attendee list', () => {
        return request
            .post(`/api/events/${testEvent._id}/attendees`)
            .set('Authorization', token)
            .send(testUser2)
            .then(({ body }) => {
                assert.equal(body.attendees.length, 1);
                assert.equal(body.attendees[0], testUser2._id);
            });
    });
});