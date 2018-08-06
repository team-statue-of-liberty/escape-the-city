const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

// const makeSimpleActivity = (activity) => {
//     const simple = {
//         _id: activity._id,
//         name: activity.name,
//         description: activity.description,
//         indoor: activity.indoor
//     };

//     return simple;
// };

let token;
let token2;
let hammock;
let floaty;
let testEvent;
let testEvent2;
// let testActivity1;
// let testActivity2;
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
            item: 'Kayak',
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
        }, token)
            .then(data => testEvent = data);
    });

    beforeEach(() => {
        return save('events', {
            description: 'Lets go to hot springs!',
            where: 'Secret spot that I know',
            when: new Date('2018-10-10'),
            groupSize: 5,
            desiredGear: [
                {
                    item: 'camp chairs'
                }

            ],
            attendees: [testUser._id],
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

    it('gets top 5 events', () => {
        return request
            .get('/api/events/top5')
            .then(checkOk)
            .then(({ body }) => {
                // where's the assertion?
                console.log('***AGGREGATION***', body);
            });
    });
});