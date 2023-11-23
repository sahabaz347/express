const userModel = require('../model/userModel');
const asyncErrorHandler = require('./../utils/AsyncErrorHandler')


class User {
    signUp = asyncErrorHandler(async (req, res, next) => {
        const newUser = await userModel.create(req.body);
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: newUser
        })
    })
}
module.exports = User;