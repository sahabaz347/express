const CustomError = require("../utils/CustomError");

const devErrors = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error

    });
}
const castErrorHandler = (error) => {
    const msg = `Invalid value for ${error.path}:${error.value}`;
    return new CustomError(msg, 400);
}
const duplicateErrorHandler = (error) => {
    const msg = `This `+Object.keys(error.keyValue)+` already exist with name `+Object.values(error.keyValue)+` please use another `+Object.keys(error.keyValue)+`!`;
    return new CustomError(msg, 400);
}
const validationErrorHandler = (error) => {
    const errorsValues = Object.values(error.errors).map(val => val.message)
    const errorsKeys = Object.keys(error.errors)
    let errors = [];
    for (let i = 0; i < errorsKeys.length; i++) {
        errors.push(errorsKeys[i] + ':' + errorsValues[i]);

    }
    const errorMessage = errors.join(', ')
    const msg = `Invalid input data(${errorMessage})`;
    return new CustomError(msg, 400);
}
const prodErrors = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "something went wrong! please try again later.",
        });
    }

}


module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "Error!";
    if (process.env.NODE_ENV === 'development') {
        devErrors(error, res)
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name == 'CastError') {
            error = castErrorHandler(error);
        } if (error.code == 11000) {
            error = duplicateErrorHandler(error);
        } if (error.name == 'ValidationError') {
            error = validationErrorHandler(error);
        }
        prodErrors(error, res)
    }

}