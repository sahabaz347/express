const express=require('express');
const router=express.Router();
const authController=require('../controller/authController');
const authControllerObj=new authController();
router.route('/signup').post(authControllerObj.signUp);
router.route('/login').post(authControllerObj.login);
router.route('/forget-password').post(authControllerObj.forgetPassword);
router.route('/reset-password/:token').patch(authControllerObj.resetPassword);
module.exports=router;