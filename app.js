// const { log } = require('console');
const express = require('express');
// const { json } = require('express/lib/response');
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
    // movies = movies.filter(movie => movie.id !== findMovieID)
    const movie = { id: findMovieID, ...req.body };
    console.log(movies)
    movies[findMovieIndex] = movie;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
        res.status(201).json({
            status: 201,
            data: movies
        })
    })
})
//create server
const port = 3000;
app.listen(port, () => {
    console.log('express start')
})
