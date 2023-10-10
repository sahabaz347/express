const express = require('express');
const moviesRouter = require('./route/moviesRouter')
let app = express();
const morgan = require('morgan');
const logger = (req, res, next) => {
    console.log('it is started....');
    next();
}
app.use(express.json());
app.use(logger);
app.use(express.static('./public'))
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})
app.use(morgan('dev'))
app.use('/app/v1/movies', moviesRouter)
module.exports = app;
