const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field!"],
        unique: true,
        minLength:[3,'minimum length should be atleast 3'],
        maxLength:[10,'maximum length should be 10'],
        // validate:[validator.isAlpha,"movie name must be a string!"],
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
        type: Number,
        // min:[1,'minimum rating is 1.0'],
        // max:[10,'maximum rating is 10'],
        validate:{
            validator:function(value){
                return value>=1 && value<=10;
            },
            message:"the value ({VALUE}) is not with in the range of 1 to 10"
        }
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
    genres: {
        type: [String],
        required: [true, "Genres is required field!"],
        // enum:{values:["Action","Thriller","Comedy"],message:"this is not aceptable genres"}
    },
    directors: {
        type: [String],
        required: [true, "Directors is required field!"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required field!"]
    },
    actors: {
        type: [String],
        required: [true, "Actor is required field!"],
        select: false
    }, price: {
        type: Number,
        required: [true, "Price is a required field!"]
    },
    createdBy: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
movieSchema.virtual('durationInHours').get(function () {
    return this.duration / 60;
})
movieSchema.pre('save', function (next) {
    this.createdBy = 'sahabaz'
    next()
})
movieSchema.post('save', function (doc, next) {
    const content = `the new text file created with name ${doc.name} as created by ${doc.createdBy}\n`;
    fs.writeFileSync('./log/test.txt', content, { flag: 'a' }, (error) => {
        if (error) {
            console.log(error.message)
        } else {
            console.log('success')
        }
    });
    next()
})
// movieSchema.pre(/^find/, function (next) {
//     this.find({ releaseDate: { $lte: Date.now() } })
//     this.startTime = Date.now();
//     next()
// })
// movieSchema.post(/^find/, function (docs, next) {
//     this.find({ releaseDate: { $lte: Date.now() } })
//     this.endTime = Date.now();
//     const content = `query excecution time is ${this.endTime-this.startTime} milisecoends\n`;
//     fs.writeFileSync('./log/test.txt', content, { flag: 'a' }, (error) => {
//         if (error) {
//             console.log(error.message)
//         } else {
//             console.log('success')
//         }
//     });
//     next()
// })
movieSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}});
    next();

})
const Movie = mongoose.model('movies', movieSchema);
module.exports = Movie
