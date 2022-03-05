// User Model modules
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
let Schema = mongoose.Schema;

// instantiating User Schema
let UserSchema = new Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'username should be entered'
    },
    password: {
        type: String,
        default: '',
        trim: true,
        required: 'password is required'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'email should be entered'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display Name is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "users"
});

// Registering passport local mongoose schema plugin
UserSchema.plugin(passportLocalMongoose, {missingPasswordError: "Wrong Password"});

module.exports = mongoose.model('User', UserSchema);