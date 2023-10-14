

const express = require('express');
const router = express.Router();
const moviesController = require('./../controller/moviesController')
const moviesModel = require('./../model/moviesModel');
router.param('id',moviesController.checkId)
router.route('/')
    .get(moviesController.getMovie)
    .post(moviesController.validateBody,moviesController.postMovie)
router.route('/:id')
    .get(moviesController.getMovieById)
    .put(moviesController.validateBody,moviesController.updateByPutDetails)
    .patch(moviesController.validateBody,moviesController.updateByPatchDetail)
    .delete(moviesController.DeleteById)
    // router.route('/xyz/we').get(moviesController.getMoviesA);

    
module.exports = router;