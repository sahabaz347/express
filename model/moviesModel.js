const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field!"],
        unique: true,
        trim: true   
    },
    description: {
        type: String,
        required: [true, "Description is required field!"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required field!"]
    },
    rating: {
        type: Number
    },
    totalRating: {
        type: Number
    },
    relaseYear: {
        type: Number,
        required: [true, "Release Year is Required field!"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres:{
        type: [String],
        required: [true, "Genres is required field!"]
    },
    directors:{
        type: [String],
        required: [true, "Directors is required field!"]
    },
    coverImage:{
        type: String,
        required: [true, "Cover image is required field!"]
    },
    actors:{
        type: [String],
        required: [true, "Actor is required field!"],
        select:false
    },price:{
        type:Number,
        required:[true,"Price is a required field!"]
    }
});
const Movie = mongoose.model('movies', movieSchema);
module.exports = Movie
