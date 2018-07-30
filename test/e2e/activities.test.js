const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe.only('Activities API', () => {

    beforeEach(() => dropCollection('activities'));

    let token; 
    beforeEach(() => {
        const testUser = {

        }
    });

    it('', () => {

    });
});