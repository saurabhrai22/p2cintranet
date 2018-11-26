const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    password: String,
    enterpriseId: String,
    active: Boolean,
    created_at: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


var User = mongoose.model('user', userSchema, 'user');

module.exports = User;