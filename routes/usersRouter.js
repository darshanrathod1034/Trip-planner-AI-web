const express = require('express');
const user = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
//const { models } = require('mongoose');
const jwt=require('jsonwebtoken');

user.get('/', (req, res) => {
  res.send('Users page is loaded ');
  
});

user.post('/register', async (req, res) => {
  try
     {let { fullname, email, password } = req.body;

      if (!fullname || !email || !password) {  return res.status(400).send('All input is required'); }
    let user= await userModel.findOne({ email: email});
    if (user){ return res.status(400).send('User already exists'); }

        bcrypt.genSalt( 10,  (err, hash) => {
          bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
              return res.status(500 ).send('Error hashing password: ' + err.message); }
            else {
              let user = await userModel.create({
                fullname,
                email,
                password: hash,
              });
               }
            let token=jwt.sign({email,id:user._id},'highhook');
            res.cookie('token',token,);
            res.status(201).send("user created");
            });

         

          
         // res.status(201).send(newuser);
        });
  } catch (err) { console.log(err); res.status(500).send('Server error'); }
});

user.post('/login', async (req, res) => {
let {email,password}=req.body;
if(!email||!password){ return res.status(400).send('All input is required'); }
let user=await userModel.findOne({email:email});
if(!user){ return res.status(400).send('email or password incorrect'); }
else{
bcrypt.compare(password,user.password,(err,match)=>{
if(err){ return res.status(500).send('Server error'); }
if(match){ 
let token=jwt.sign({email,id:user._id},'highhook');
res.cookie('token',token).send('you are logged inn');;
 }
else{ return res.status(400).send('email or password incorrect'); }
});

user.post('/logout',(req,res)=>{
    res.clearCookie('token').send('you are logged out');
    
    });

}

});
module.exports = user;
