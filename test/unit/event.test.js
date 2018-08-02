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
            attendees: [],
            desiredGear: [{
                item: 'Cornhole'
            },
            {
                item: 'Kayak'
            }],
            ownerId: Types.ObjectId()
        };
        const event = new Event(data);

        const json = event.toJSON();
        delete json._id;
        json.desiredGear.forEach(item => delete item._id);
        assert.deepEqual(json, data);
    });

    it('validates that all fields are required', () => {
        const event = new Event({
            desiredGear: [{}]
        });
        const errors = getErrors(event.validateSync(), 4);
        assert.equal(errors.where.kind, 'required');
        assert.equal(errors.when.kind, 'required');
        assert.equal(errors['desiredGear.0.item'].kind, 'required');
        assert.equal(errors.ownerId.kind, 'required');
    });

    it('does not accept invalid min values', () => {
        const event = new Event({
            description: 'fun in the sun at Lost Lake',
            where: 'Lost Lake',
            when: new Date(),
            groupSize: 0,
            desiredGear: [{
                item: 'Cornhole'
            },
            {
                item: 'Kayak'
            }],
            ownerId: Types.ObjectId()
        });
        const errors = getErrors(event.validateSync(), 1);
        assert.equal(errors.groupSize.kind, 'min');
        event.groupSize = 5;
        assert.isUndefined(event.validateSync());
    });
});