const nodemailer = require('nodemailer');
const { getMaxListeners } = require('../model/userModel');
const saindEmail = async (option) => {
    //create transporter
    const transproter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    //define email options
    const emailOptions={
        from:'sahabaz support<sahabazc3@getMaxListeners.com>',
        to:option.email,
        subject:option.subject,
        text:option.message
    }
    await transproter.sendMail(emailOptions);
}
module.exports = saindEmail