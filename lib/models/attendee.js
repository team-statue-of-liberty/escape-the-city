const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    attendees: [Schema.Types.ObjectId]
});


module.exports = mongoose.model('Attendee', schema);