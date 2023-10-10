

const express = require('express');
const router = express.Router();
const moviesController = require('./../controller/moviesController')
router.param('id',moviesController.checkId)
router.route('/')
    .get(moviesController.getMovie)
    .post(moviesController.validateBody,moviesController.postMovie)
router.route('/:id')
    .get(moviesController.getMovieById)
    .put(moviesController.updateByPutDetails)
    .patch(moviesController.updateByPatchDetail)
    .delete(moviesController.DeleteById)

module.exports = router;