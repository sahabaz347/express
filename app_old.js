const { log } = require('console');
const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))
app.use(express.json());
//route=http method +url
app.get('/app/v1/movies', (req, res) => {
    res.status(200).json({
        status: 200,
        count: movies.length,
        data: {
            movies
        }
    })
})
app.post('/app/v1/movies', (req, res) => {
    const newId = movies[movies.length - 1].id + 1;
    const movie = { ...{ id: newId }, ...req.body }
    movies = [...movies, movie];
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            data: { movie }
        })
    })
    // console.log(movies)
})
app.get('/app/v1/movies/:id', (req, res) => {
    const movieIdToFind = +req.params.id;
    const foundMovie = movies.find(movies => movies.id === movieIdToFind)
    try {
        if (!foundMovie) {
            return res.status(404).json({
                status: 404,
                massage: "Movie with id " + movieIdToFind + " is not found",
                data: []
            })
        }
        res.status(200).json({
            status: 200,
            massage: "success",
            data: foundMovie
        })

    } catch (error) {
        console.error(error.message)
    }
})
app.put('/app/v1/movies/:id', (req, res) => {
    findMovieID = +req.params.id;
    const findMovieIndex = movies.findIndex(movie => movie.id === findMovieID);
    if (findMovieIndex == -1) {
        return res.status(404).json({
            status: 404,
            massage: "Movie with id " + findMovieID + " is not found",
            data: []
        })
    }
    const movie = { id: findMovieID, ...req.body };
    movies[findMovieIndex] = movie;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            data: movie
        })
    })
})
app.patch('/app/v1/movies/:id', (req, res) => {
    const findId = + req.params.id;
    let getMovieItemById = movies.find(movie => movie.id === findId);
    if (!getMovieItemById) {
        return res.status(404).json({
            status: 404,
            massage: "Movie with id " + findId + " is not found",
            data: []
        })
    }
    let getMovieIndex = movies.findIndex(movie => movie.id === findId);
    updateMovie = { ...getMovieItemById, ...req.body };
    movies[getMovieIndex] = updateMovie;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            data: updateMovie
        })
    })

})
app.delete('/app/v1/movies/:id', (req, res) => {
    let deleteMovieId = +req.params.id;
    isValueExist = movies.find(movie => movie.id === deleteMovieId);
    if (!isValueExist) {
        return res.status(404).json({
            status: 404,
            massage: "Movie with id " + deleteMovieId + " is not found",
            data: []
        })
    }
    movies = movies.filter(movie => movie.id !== deleteMovieId);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(204).json({
            status: 201,
            massage: "success",
            data: { movies }
        })
    })
})
//create server
const port = 3000;
app.listen(port, () => {
    console.log('express start')
})
