const chai = require('chai');
const { assert } = chai;
const { Types } = require('mongoose');
const Attendee = require('../../lib/models/attendee');
const { getErrors } = require('./helpers');

describe('Attendee model', () => {

    it('validates good attendee model', () => {
        const data = {
            eventId: Types.ObjectId(),
            attendees: [Types.ObjectId()]
        };

        const attendee = new Attendee(data);
        const json = attendee.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(attendee.validateSync());
    });

    it('validates required field', () => {
        const attendee = new Attendee({});
        const errors = getErrors(attendee.validateSync(), 1);
    
        assert.equal(errors.eventId.kind, 'required');
    });
});