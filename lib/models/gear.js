const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    item: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: Number,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

});

module.exports = mongoose.model('Gear', schema);