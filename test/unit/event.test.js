const chai = require('chai');
const { assert } = chai;
const { Types } = require('mongoose');
const Event = require('../../lib/models/event');
const { getErrors } = require('./helpers');

describe('Events model', () => {

    it('validates good model', () => {
        const data = {
            description: 'fun in the sun at Lost Lake',
            where: 'Lost Lake',
            when: new Date(),
            groupSize: 8,
            bringGear: ['Cornhole', 'Kayak', 'football'],
            createdBy: Types.ObjectId()
        };
        const event = new Event(data);

        const json = event.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that all fields are required', () => {
        const event = new Event({});
        const errors = getErrors(event.validateSync(), 4);
        assert.equal(errors.where.kind, 'required');
        assert.equal(errors.when.kind, 'required');
        assert.equal(errors.bringGear.kind, 'required');
        assert.equal(errors.createdBy.kind, 'required');
    });
});