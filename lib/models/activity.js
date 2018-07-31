const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    eventId:{ 
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    indoor: {
        type: Boolean,
        required: true
    }     
});

module.exports = mongoose.model('Activity', schema);