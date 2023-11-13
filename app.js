const express = require('express');
const moviesRouter = require('./route/moviesRouter');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controller/errorController');
let app = express();
const morgan = require('morgan');
const logger = (req, res, next) => {
    console.log('it is started....');
    next();
}
app.use(express.json());
app.use(express.static('./public'))
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})
if (process.env.NODE_ENV == 'development') {
    app.use(logger);
    app.use(morgan('dev'))
}
app.use('/app/v1/movies', moviesRouter)
app.all('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server!`, 404)
    next(err);
})
app.use(globalErrorHandler)
module.exports = app;
