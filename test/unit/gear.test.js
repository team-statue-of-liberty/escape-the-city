const chai = require('chai');
const { assert } = chai;
const GearModel = require('../../lib/models/gear');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');

describe('Gear API', () => {

    it('validates good model', () => {
        const data = {
            item: 'Grill',
            description: 'coleman 2 burner propane',
            quantity: 1,
            ownerId: Types.ObjectId()     
        };
        const gear = new GearModel(data);

        const json = gear.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(gear.validateSync());
    });
    
    it('validates required fields', () => {
        const gear = new GearModel({});
        const errors = getErrors(gear.validateSync(), 2);
        assert.equal(errors.item.kind, 'required');
        assert.equal(errors.description.kind, 'required');  
    });
});