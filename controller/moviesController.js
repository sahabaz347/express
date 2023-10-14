const fs = require('fs');
const moviesModel = require('./../model/moviesModel');
exports.checkId = async (req, res, next, value) => {
    let movieList = await getMovies();
    let movies = movieList.map(row => Object.assign({}, row));
    const movieIdToFind = +value;
    const foundMovie = movies.find(movie => movie.id === movieIdToFind)
    if (!foundMovie) {
        return errorFunction(req, res, "Movie with id " + movieIdToFind + " is not found");
    }
    next();
}
exports.validateBody = (req, res, next) => {
    const  keyList=['name','relaseDate','duration'];
    switch (req.method) {
        case "PATCH":
            const areAllKeysValid = Object.keys(req.body).every(key => keyList.includes(key));
            if(!areAllKeysValid){
                return errorFunction(req, res, "please provide the correct details ")
            }
            break;
        default:
            if (!req.body.name) {
                return errorFunction(req, res, "please provide the name details ")
            } else if (!req.body.relaseDate) {
                return errorFunction(req, res, "please provide the relasedate details")
            } else if (!req.body.duration) {
                return errorFunction(req, res, "please provide the duration details")
            }
            break;
    }

    next();
}
exports.getMovie = async (req, res) => {
    let movieList = await getMovies();
    let movies = movieList.map(row => Object.assign({}, row));
    res.status(200).json({
        status: 200,
        requestedAt: req.requestedAt,
        count: movies.length,
        data: { movies }
    })
}
exports.postMovie = async (req, res) => {
    postMovie = await moviesModel.postMovieList(req.body);
    const movie = { ...{ id: postMovie.insertId }, ...req.body }
    res.status(201).json({
        status: 201,
        requestedAt: req.requestedAt,
        data: { movie }
    })
}
exports.getMovieById = async (req, res) => {
    const movieIdToFind = +req.params.id;
    let movieDetails = await getMovies(movieIdToFind);
    let movie = movieDetails.map(row => Object.assign({}, row));
    res.status(200).json({
        status: 200,
        requestedAt: req.requestedAt,
        massage: "success",
        data: movie
    })

}
exports.updateByPutDetails = async (req, res) => {
    findMovieID = +req.params.id;
    updateMovie = await moviesModel.updateMovieByPut(req.method, findMovieID, req.body);
    if (updateMovie.affectedRows == 1) {
        const movie = { id: findMovieID, ...req.body };
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: movie
        })
    }
}
exports.updateByPatchDetail = async (req, res) => {
    const findMovieID = + req.params.id;
    updateMovie = await moviesModel.updateMovieByPut(req.method, findMovieID, req.body);
    if (updateMovie.affectedRows == 1) {
        let movieDetails = await getMovies(findMovieID);
        let movie = movieDetails.map(row => Object.assign({}, row));
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: movie
        })
    }
}
exports.DeleteById = async (req, res) => {
    let deleteMovieId = +req.params.id;
    deleteMovie = await moviesModel.deleteMovieFromList(deleteMovieId)
    if (deleteMovie) {
        res.status(204).json({
            status: 204,
            massage: "success",
            data: null
        })
    }
}
const errorFunction = (req, res, massage) => {
    return res.status(404).json({
        status: 404,
        requestedAt: req.requestedAt,
        massage: massage,
        data: []
    })
}
const getMovies = async (movieIdToFind, req, res) => {
    try {
        return await moviesModel.getMovieList(movieIdToFind);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).send('Internal Server Error');
    }
};