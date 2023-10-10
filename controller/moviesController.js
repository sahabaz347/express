const fs = require('fs');
let movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))

//route=http method +url
exports.checkId = (req, res, next, value) => {
    const movieIdToFind = +value;
    const foundMovie = movies.find(movies => movies.id === movieIdToFind)
    if (!foundMovie) {
        return errorFunction(req, res, "Movie with id " + movieIdToFind + " is not found");
    }
    next();
}
exports.validateBody = (req, res, next) => {
    if (!req.body.name) {
        return errorFunction(req, res, "please provide the name details ")
    } else if (!req.body.relaseDate) {
        return errorFunction(req, res, "please provide the relasedate details")

    }
    next();
}
exports.getMovie = (req, res) => {
    res.status(200).json({
        status: 200,
        requestedAt: req.requestedAt,
        count: movies.length,
        data: {
            movies
        }
    })
}
exports.postMovie = (req, res) => {
    let newId = 1;
    if (movies.length > 0) {
        newId = movies[movies.length - 1].id + 1;
    }
    const movie = { ...{ id: newId }, ...req.body }
    movies = [...movies, movie];
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: { movie }
        })
    })
    // console.log(movies)
}
exports.getMovieById = (req, res) => {
    const movieIdToFind = +req.params.id;
    const foundMovie = movies.find(movies => movies.id === movieIdToFind)
    res.status(200).json({
        status: 200,
        requestedAt: req.requestedAt,
        massage: "success",
        data: foundMovie
    })

}
exports.updateByPutDetails = (req, res) => {
    findMovieID = +req.params.id;
    const findMovieIndex = movies.findIndex(movie => movie.id === findMovieID);
    const movie = { id: findMovieID, ...req.body };
    movies[findMovieIndex] = movie;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: movie
        })
    })
}
exports.updateByPatchDetail = (req, res) => {
    const findId = + req.params.id;
    let getMovieItemById = movies.find(movie => movie.id === findId);
    let getMovieIndex = movies.findIndex(movie => movie.id === findId);
    updateMovie = { ...getMovieItemById, ...req.body };
    movies[getMovieIndex] = updateMovie;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: updateMovie
        })
    })

}
exports.DeleteById = (req, res) => {
    let deleteMovieId = +req.params.id;
    isValueExist = movies.find(movie => movie.id === deleteMovieId);
    movies = movies.filter(movie => movie.id !== deleteMovieId);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(204).json({
            status: 201,
            massage: "success",
            data: { movies }
        })
    })
}
const errorFunction = (req, res, massage) => {
    return res.status(404).json({
        status: 404,
        requestedAt: req.requestedAt,
        massage: massage,
        data: []
    })
}