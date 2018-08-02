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

const save = (path, data, token = null) => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

let token;
let token2;
let floaty;
let hammock;

const user = {
    email: 'Chris@test.com',
    firstName: 'Chris',
    driver: false,
    password: 'pass123'
};
const user2 = {
    email: 'Mariah@test.com',
    firstName: 'Mariah',
    driver: false,
    password: 'abc123'
};

describe.only('Users API', () => {
    
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('gears'));
    
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
            .send(user2)
            .then(checkOk)
            .then(({ body }) => {
                token2 = body.token;
                verify(token2)
                    .then((body) => {
                        user2._id = body.id;
                    });
            });
    });

    beforeEach(() => {
        return save('gears', {
            item: 'hammock',
            description: 'Eno Double Nest 300lb capacity',
            quantity: 1,
            ownerId: user._id
        }, token) 
            .then(data => hammock = data);
    });

    beforeEach(() => {
        return save('gears', {
            item: 'floaty',
            description: 'unicorn',
            quantity: 3,
            ownerId: user._id
        }, token) 
            .then(data => floaty = data);
    });

    it('signs up the user', () => {
        assert.isDefined(token);
    });

    it('gets a user by id', () => {
        return request
            .get(`/api/users/${user._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.firstName, user.firstName);
                assert.equal(body.driver, false);
                assert.isUndefined(body.password);
                assert.isUndefined(body.hash);
            });
    });

    it('gets all gear a user has to offer', () => {
        return request  
            .get(`/api/users/${user._id}/gear`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimpleGear(hammock), makeSimpleGear(floaty)]);   
            });
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

    it('allows a user to delete their profile', () => {
        return request
            .delete(`/api/users/${user._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
    it.only('does not allow a user to delete another profile', () => {
        return request
            .delete(`/api/users/${user._id}`)
            .set('Authorization', token2)
            .then(({ body }) => {
                assert.deepEqual(body, { error: 'Unauthorized' });
            });
    });
});

