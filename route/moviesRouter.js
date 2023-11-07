

const express = require('express');
const router = express.Router();
const moviesController = require('./../controller/moviesController')
const moviesControllerObj=new moviesController();
router.route('/heighest-rated').get(moviesControllerObj.getHeighestRetedMovie,moviesControllerObj.getMovies)
router.route('/')
.get(moviesControllerObj.getMovies)
.post(moviesControllerObj.postMovie)
router.route('/movies-stats').get(moviesControllerObj.getMoviesStats)
router.route('/:id')
    .get(moviesControllerObj.getMovieById)
    .put(moviesControllerObj.updateByPutDetails)
    .patch(moviesControllerObj.updateByPatchDetail)
    .delete(moviesControllerObj.DeleteById)

    
module.exports = router;