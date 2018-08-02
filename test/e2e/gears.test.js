const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { verify } = require('../../lib/utils/token-service');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

const makeSimpleGear = (gear) => {
    const makeSimple = {
        _id: gear._id,
        item: gear.item,
        description: gear.description,
        quantity: gear.quantity,
        ownerId: gear.ownerId
    };

    return makeSimple;
};


let token;
let floaty;
let hammock;

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

describe('Gears API', () => {

    beforeEach(() => dropCollection('users'));
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
        return save('gears', {
            item: 'hammock',
            description: 'Eno Double Nest 300lb capacity',
            quantity: 1,
            ownerId: testUser._id
        }, token) 
            .then(data => hammock = data);
    });

    beforeEach(() => {
        return save('gears', {
            item: 'floaty',
            description: 'unicorn',
            quantity: 3,
            ownerId: testUser._id
        }, token) 
            .then(data => floaty = data);
    });

    it('saves a gear item', () => {
        assert.isDefined(floaty);
    });

    it('allows user to edit gear items', () => {
        floaty.description = 'giant donut';
        return request
            .put(`/api/gears/${floaty._id}`)
            .set('Authorization', token)
            .send(floaty)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.description, floaty.description);
            });
    });

    it('allows user to delete gear', () => {
        return request
            .delete(`/api/gears/${floaty._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
});