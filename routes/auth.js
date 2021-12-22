const express=require('express');

const router=express.Router();
const authControllers=require('../controllers/auth.js');

router.post('/signup',authControllers.signup);
router.post('/signin',authControllers.login);

module.exports=router;
