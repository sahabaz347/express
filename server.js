//create server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const app = require('./app');
console.log(process.env.PORT)
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log('Database connection successfull');
}).catch((error) => {
    console.log(error.message)
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('express start...')
})