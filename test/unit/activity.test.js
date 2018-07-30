const chai = require('chai');
const { assert } = chai;
const { Types } = require('mongoose');
const Activity = require('../../lib/models/activity');
const { getErrors } = require('./helpers');

describe('Activity model', () => {

    it('validates a good activity model', () => {
        const data = {
            name: 'swimming',
            description: 'indoor swimming',
            eventId: Types.ObjectId(),
            indoor: true
        };

        const activity = new Activity(data);
        const json = activity.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(activity.validateSync());
    });

    it('validates required fields', () => {
        const activity = new Activity({});
        const errors = getErrors(activity.validateSync(), 2);

        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.indoor.kind, 'required');
    });
});