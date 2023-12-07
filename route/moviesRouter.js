

const express = require('express');
const router = express.Router();
const moviesController = require('./../controller/moviesController')
const authController=require('./../controller/authController')
const moviesControllerObj=new moviesController();
const authControllerObj=new authController();
router.route('/heighest-rated').get(moviesControllerObj.getHeighestRetedMovie,moviesControllerObj.getMovies)
router.route('/movies-stats').get(moviesControllerObj.getMoviesStats)
router.route('/movies-genres/:genres').get(moviesControllerObj.getMoviesGenres)

router.route('/')
.get(authControllerObj.protectRoute,moviesControllerObj.getMovies)
.post(authControllerObj.protectRoute,moviesControllerObj.postMovie)
router.route('/:id')
    .get(authControllerObj.protectRoute,moviesControllerObj.getMovieById)
    .put(authControllerObj.protectRoute,moviesControllerObj.updateByPutDetails)
    .patch(authControllerObj.protectRoute,moviesControllerObj.updateByPatchDetail)
    .delete(authControllerObj.protectRoute,authControllerObj.restricted('admin'),moviesControllerObj.DeleteById)

    
module.exports = router;