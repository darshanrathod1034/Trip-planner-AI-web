const jwt=require('jsonwebtoken');
const userModel = require('../models/users-model');
const e = require('express');
module.exports=async (req,res,next)=>{

//let decoded=jwt.verify(req.cookies.token,'highhook');
if(!req.cookies.token){ 
    res.flash('error','Please login first');
    return res.redirect('/'); }

try{
    let decoded=jwt.verify(req.cookies.token,'highhook');
    let user=await userModel.findOne({email:decoded.email}).select('-password');

    req.user=user;
    next();

}
catch(error){
    res.flash('error','Please login first');
    return res.redirect('/');

}









}