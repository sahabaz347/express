const MovieModel = require('./../model/moviesModel')
const ApiFeature = require('./../utils/ApiFeature')

class Movie {
    getHeighestRetedMovie = (req, res, next) => {
        req.query.rating = { gte: '9' }
        req.query.limit = '2';
        req.query.sort = 'rating';
        req.query.fields = 'name,duration,rating';
        next();
    }
    getMovies = async (req, res) => {
        try {
            const featureObj = new ApiFeature(MovieModel.find(), req.query).filter().sort().fields().pagination(MovieModel.countDocuments())
            let getMoviesData = await featureObj.query;
            if (getMoviesData.length == 0)
                throw new Error('No movie found!')
            res.status(201).json({
                status: 201,
                length: getMoviesData.length,
                requestedAt: req.requestedAt,
                data: getMoviesData
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }
    }
    postMovie = async (req, res) => {
        try {
            const postData = await MovieModel.create(req.body);
            res.status(201).json({
                status: 201,
                requestedAt: req.requestedAt,
                data: postData
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }


    }
    getMovieById = async (req, res) => {
        try {
            // const getMovie = await MovieModel.find({_id:req.params.id});
            const getMovie = await MovieModel.findById(req.params.id);
            if (getMovie === null)
                throw new Error('No movie found!')
            res.status(201).json({
                status: 201,
                requestedAt: req.requestedAt,
                data: getMovie
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }

    }
    updateByPutDetails = async (req, res) => {
        try {
            const updateMovieData = await MovieModel.updateOne({ _id: req.params.id }, { $set: req.body }, { runValidators: true });
            if (updateMovieData.modifiedCount != 1) {
                throw new Error('please provide correct details')
            }
            const getMovie = await MovieModel.findById(req.params.id);

            res.status(201).json({
                status: 201,
                requestedAt: req.requestedAt,
                data: getMovie
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }
    }
    updateByPatchDetail = async (req, res) => {
        try {
            const updateMovieData = await MovieModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            res.status(201).json({
                status: 201,
                requestedAt: req.requestedAt,
                data: updateMovieData
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }
    }
    DeleteById = async (req, res) => {
        try {
            const getMoviesData = await MovieModel.findByIdAndDelete(req.params.id);
            if (getMoviesData === null)
                throw new Error('No movie found!')
            res.status(204).json({
                status: 204,
                requestedAt: req.requestedAt,
                data: null
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }
    }
    getMoviesStats = async (req, res) => {
        try {
            let stat = await MovieModel.aggregate([
                { $match: { rating: { $gte: 8 } } },
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
        } catch (error) {
            res.status(400).json({
                status: 400,
                requestedAt: req.requestedAt,
                message: error.message
            })
        }
    }
}
module.exports = Movie

