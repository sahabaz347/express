//create server
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const app = require('./app');
console.log(process.env.PORT)
const port =process.env.PORT || 3000;
app.listen(port, () => {
    console.log('express start...')
})