const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    year: { 
        type: String, 
        required: true 
    },
    branch: { 
        type: String, 
        required: true 
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date, 
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    status: {
        type: String, 
        enum: ['pending', 'verified', 'inactive'], 
        default: 'pending', 
    }
});

module.exports = mongoose.model('User', userSchema);