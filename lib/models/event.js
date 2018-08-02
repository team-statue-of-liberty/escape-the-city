const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    description: String,
    where: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        required: true
    },
    groupSize: {
        type: Number,
        min: 2
    },
    desiredGear: [{
        item: {
            type: String,
            required: true
        }
    }],
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    attendees: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
    
});


module.exports = mongoose.model('Event', schema);