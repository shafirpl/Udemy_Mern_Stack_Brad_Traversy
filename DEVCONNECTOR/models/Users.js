/*
* we will be using this file to model our user in mongodb database
* it is convention to name schema/model files as uppercase
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        // this will give us current date and time
        default: Date.now()
    }
})

module.exports = User = mongoose.model('user', userSchema);
