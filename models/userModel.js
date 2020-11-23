const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true, minLength: 9},
    displayName: {type: 'string'},
});

module.exports = User = mongoose.model('user', userSchema);
