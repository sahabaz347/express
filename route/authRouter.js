const express=require('express');
const router=express.Router();
const authController=require('../controller/authController');
const authControllerObj=new authController();
router.route('/signup').post(authControllerObj.signUp);
router.route('/login').post(authControllerObj.login);
module.exports=router;