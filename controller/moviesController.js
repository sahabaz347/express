const CustomError = require('../utils/CustomError')
const MovieModel = require('./../model/moviesModel')
const ApiFeature = require('./../utils/ApiFeature')
const asyncErrorHandler = require('./../utils/AsyncErrorHandler')

class Movie {
    getHeighestRetedMovie = (req, res, next) => {
        req.query.rating = { gte: '6' }
        req.query.limit = '21';
        req.query.sort = 'rating';
        req.query.fields = 'name,duration,rating';
        next();
    }
    getMovies = asyncErrorHandler(async (req, res, next) => {
        const featureObj = new ApiFeature(MovieModel.find(), req.query).filter().sort().fields().pagination(MovieModel.countDocuments())
        let getMoviesData = await featureObj.query;

        if (getMoviesData.length == 0)
            throw new Error('No movie found!')
        res.status(201).json({
            status: 201,
            length: getMoviesData.length,
            requestedAt: req.requestedAt,
            user:req.user,
            data: getMoviesData
        })
    })
    postMovie = asyncErrorHandler(async (req, res, next) => {
        const postData = await MovieModel.create(req.body);
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: postData
        })
    })
    getMovieById = asyncErrorHandler(async (req, res, next) => {
        // const getMovie = await MovieModel.find({_id:req.params.id});
        const getMovie = await MovieModel.findById(req.params.id);
        if (!getMovie) {
            const err = new CustomError("Movie with that id is not found!", 404);      
            return next(err);
        }
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: getMovie
        })
    })
    updateByPutDetails = asyncErrorHandler(async (req, res, next) => {
        const updateMovieData = await MovieModel.updateOne({ _id: req.params.id }, { $set: req.body }, { runValidators: true });
        if (!updateMovieData.modifiedCount && !updateMovieData.matchedCount) {
            const err = new CustomError("Movie with that id is not found!", 404);
            return next(err);
        }
        const getMovie = await MovieModel.findById(req.params.id);

        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: getMovie
        })
    })
    updateByPatchDetail = asyncErrorHandler(async (req, res, next) => {
        const updateMovieData = await MovieModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updateMovieData) {
            const err = new CustomError("Movie with that id is not found!", 404);
            return next(err);
        }
        res.status(201).json({
            status: 201,
            requestedAt: req.requestedAt,
            data: updateMovieData
        })
    })
    DeleteById = asyncErrorHandler(async (req, res, next) => {
        const getMoviesData = await MovieModel.findByIdAndDelete(req.params.id);
        if (!getMoviesData) {
            const err = new CustomError("Movie with that id is not found!", 404);
            return next(err);
        }
        res.status(204).json({
            status: 204,
            requestedAt: req.requestedAt,
            data: null
        })
    })
    getMoviesStats = asyncErrorHandler(async (req, res, next) => {
        let stat = await MovieModel.aggregate([
            {
                $group: {
                    _id: '$relaseYear',
                    avgRating: { $avg: '$rating' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $avg: '$price' },
                    maxPrice: { $avg: '$price' },
                    priceTotal: { $sum: '$price' },
                    movieCount: { $sum: 1 },
                }
            },
            { $sort: { minPrice: 1 } }
        ])
        res.status(200).json({
            status: 200,
            length: stat.length,
            requestedAt: req.requestedAt,
            data: stat
        })
    })
    getMoviesGenres = asyncErrorHandler(async (req, res, next) => {
        const genres = req.params.genres;
        const movies = await MovieModel.aggregate([
            { $unwind: '$genres' },
            {
                $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name' }
                }
            },
            { $addFields: { genres: "$_id" } },
            { $project: { _id: 0 } },
            { $sort: { movieCount: -1 } },
            // {$limit:2}
            { $match: { genres: genres } }
        ])
        res.status(200).json({
            status: 200,
            length: movies.length,
            requestedAt: req.requestedAt,
            data: movies
        })
    })
}
module.exports = Movie

