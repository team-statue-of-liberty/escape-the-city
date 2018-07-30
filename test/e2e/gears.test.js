const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe('Gears API', () => {

    beforeEach(() => dropCollection('gears'));

    let floaty;
    beforeEach(() => {
        return request  
            .post('/api/gears')
            .send(floaty)
            .then(checkOk)
            .then(({ body }) => {
                floaty = body.floaty;
            });
    });

    it('saves a gear item', () => {
        assert.isDefined(floaty);
    });


});