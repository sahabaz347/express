//create server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
process.on('uncaughtException',(error)=>{
    console.log('uncaught rejection occured! shutting down..')
        process.exit(1)
})
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
const server=app.listen(port, () => {
    console.log('express start...')
})
process.on('unhandledRejection',(error)=>{
    console.log('unhandle rejection occured! shutting down..')
    server.close(()=>{
        process.exit(1)
    })
})
