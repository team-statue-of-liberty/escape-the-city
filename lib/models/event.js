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
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
    
});

schema.statics = {
    findTop5() {
        return this.aggregate([
            { $group : { _id: '$description', attendees: { $first: '$attendees' } } },
            { $project: {
                numberOfAttendees: { $size: '$attendees' }
            } },
            { $sort : { numberOfAttendees: -1 } },
            { $limit : 5 }
        ]);
    }
};

module.exports = mongoose.model('Event', schema);