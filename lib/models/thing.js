const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    //your schema model
});

module.exports = mongoose.model('Thing', schema);