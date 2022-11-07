const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const salt = 4;
const route = express.Router();
require('../database/connect');
const db = require('../database/schemadb');

route.use(express.static(path.join(__dirname,'../../public')));
route.use(express.urlencoded({extended:false}));
route.use(express.json());

route.get('/',(req,res) => {
    res.send('<h1>Hello ji kaise ho ?<h1>');
})

route.get('/signup' , (req,res) =>{
 res.status(200).sendFile(path.join(__dirname,"../../public/signup/index.html"));
});
route.post('/signup', async (req,res) => {
    console.log(req.body);
  try{
    const username=req.body.username;
    const password=await bcrypt.hash(req.body.password,salt);
    const user = new db({
     username : username,
     password : password
    });
    await user.save();
    res.status(201).json({message : 'user created',isCreated:true});
   
  }
  catch(error){
    res.status(403).json({message : 'user already exists',isCreated:false});
  }
});
route.get('/login',(req,res) => {
    res.send('Login here under construction');
});

module.exports = route;