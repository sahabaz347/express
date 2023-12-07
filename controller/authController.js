const userModel = require('../model/userModel');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('./../utils/AsyncErrorHandler');
const jwt = require('jsonwebtoken');
const util = require('util');
const email = require('./../utils/email');
const crypto=require('crypto');




class User {
    signInToken = (id, name) => {
        return jwt.sign({ id, name }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRE });
    }
    signUp = asyncErrorHandler(async (req, res, next) => {
        const newUser = await userModel.create(req.body);
        const token = this.signInToken(newUser._id, newUser.name);
        const { password, ...user } = newUser._doc
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            token,
            data: user
        })
    })
    login = asyncErrorHandler(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = new CustomError('Please provide Email & Password', 400);
            return next(err)
        }
        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password, user.password))) {
            const err = new CustomError('Incorrect Email or Password !', 400);
            return next(err)
        }
        const token = this.signInToken(user._id, user.name);
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            token
        })
    })
    protectRoute = asyncErrorHandler(async (req, res, next) => {
        //1.is there any authentication header
        const testToken = req.headers.authorization;
        if (!testToken || !testToken.startsWith('Bearer')) {
            const err = new CustomError('You are not loged in!', 401);
            return next(err)
        }
        const token = testToken.split(" ")[1];
        //2.verify the token
        const decodeStr = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        //3.If the user exist
        const user = await userModel.findById(decodeStr.id);
        if (!user) {
            const err = new CustomError('The user with the given token does not exist!', 401)
            return next(err);
        }
        //4.if the user changed password after the token was issued
        const isPasswordChanged = await user.passwordChange(decodeStr.iat)
        if (isPasswordChanged) {
            const err = new CustomError('Password han been changed recently.Please login again!', 401)
            return next(err);
        }
        req.user = user;
        next()
    })
    restricted = (...role) => {
        return (req, res, next) => {
            if (!role.includes(req.user.role)) {
                const err = new CustomError("You don't have permission to delete this movie", 403);
                return next(err)
            }
            next()
        }
    }
    forgetPassword = asyncErrorHandler(async (req, res, next) => {
        //1.get user based on posted email
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            const err = new CustomError('We could not find the user with given email!', 401);
            return next(err)
        }
        //2.generate a random reset token
        const resetToken = await user.createResetPasswordToken();
        //3.send the token back to the user email
        console.log('users',user)
        await user.save({ validateBeforeSave: false })
        const resetUrl = `${req.protocol}://${req.get('host')}/app/v1/users/reset-password/${resetToken}`;
        const message = `We have recive a password reset request.Please use the below link to reset your password\n\n${resetUrl}\n\n The reset password link is valid for 10 minute only! and ${user.passwordResetToken} `;
        try {
            await email({
                email: user.email,
                subject: `Password change request recived`,
                message: message
            })
            res.status(200).json({
                status: 'success',
                message: 'Password reset link send to the user email'
            })
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires = undefined;
            await user.save({ validateBeforeSave: false });
            const msg = `This was an error sending password reset email.Please try again later`;
            err = new CustomError(msg, 500)
            return next(err);
        }
    })
    resetPassword = asyncErrorHandler(async (req, res, next) => {
        // if the user exist for the given token and not expire
        const token=crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user= await userModel.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}})
        if(!user){
            const err=new CustomError('Token is invalid or expired!',404);
            next(err);
        }
        //reset user user password
        user.password=req.body.password;
        user.confirmPassword=req.body.confirmPassword;
        user.passwordChangedAt=Date.now();
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpires=undefined;
         user.save();
        const loginToken = this.signInToken(user._id, user.name);
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            token:loginToken
        })

    })

}
module.exports = User;