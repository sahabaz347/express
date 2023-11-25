const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter your password.'],
        minlength: 8,
        select:false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        minlength: 8,
        validate: {
            validator: function (val) {
                return val == this.password
            },
            message: 'Password & Confirm Password does not match!'
        }
    }
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next()
})
userSchema.methods.comparePassword=async function(pass,dbPass){
return await bcrypt.compare(pass,dbPass);
}
const User = mongoose.model('User', userSchema);
module.exports = User;