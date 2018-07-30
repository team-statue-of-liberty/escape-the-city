const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    eventId: Schema.Types.ObjectId,
    indoor: {
        type: Boolean,
        required: true
    }     
});


module.exports = mongoose.model('Activity', schema);