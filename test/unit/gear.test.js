const chai = require('chai');
const { assert } = chai;
const Gear = require('../../lib/models/gear');
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
        const gear = new Gear(data);

        const json = gear.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(gear.validateSync());
    });
    
    it('validates required fields', () => {
        const gear = new Gear({});
        const errors = getErrors(gear.validateSync(), 3);
        assert.equal(errors.item.kind, 'required');
        assert.equal(errors.description.kind, 'required');  
    });
});