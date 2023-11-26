const userModel = require('../model/userModel');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('./../utils/AsyncErrorHandler');
const jwt = require('jsonwebtoken');
const util = require('util');


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
        if (!testToken || testToken.starts) {
            const err = new CustomError('Authentication Required!', 400);
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
        req.user=user;
        next()
    })
}
module.exports = User;