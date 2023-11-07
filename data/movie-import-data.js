const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../model/moviesModel')
dotenv.config({ path: './config.env' })
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log('database connected!');
}).catch((error) => {
    console.log(error.message);
})
//read movie json file
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))
//delete data
const deleteMovieData = async () => {
    try {
        await Movie.deleteMany();
        console.log('movie collection deleted successfully');
    } catch (error) {
        console.log(error.message)
    }
    process.exit()
}
//import movie data
const importMovieData = async () => {
    try {
       await  Movie.create(movies)
        console.log('movie collection created successfully');
    } catch (error) {
        console.log(error.message)
    }
    process.exit()

}
if(process.argv[2]=== '--import'){
    importMovieData()
}else if(process.argv[2]=== '--delete'){
    deleteMovieData()
}