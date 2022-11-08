require('dotenv').config();

const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;

const salt = Number(process.env.SALT);
const jwt = require('jsonwebtoken');
const route = express.Router();
require('../database/connect');
const db = require('../database/schemadb');
const session = require('express-session');

route.use(express.static(path.join(__dirname,'../../public')));
route.use(express.urlencoded({extended:false}));
route.use(express.json());
route.use(session({
  resave : false,
  saveUninitialized:true,
  cookie:{maxAge : Number(process.env.AGE)},
  secret: String(secret_key)
}));

route.get('/',(req,res) => {
    res.send('<h1>Hello ji kaise ho ?<h1>');
})
//-------------Sign up--------------------
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
    console.log(error)
    res.status(403).json({message : 'user already exists',isCreated:false,error:error});
  }
});
//----------- LOGIN -----------------
route.get('/login',(req,res) => {
  res.status(200).sendFile(path.join(__dirname,"../../public/login/index.html"));
});
route.post('/login',async (req,res) => {
  const {username ,  password} = req.body;
  const user = await db.findOne({username : username});
  if(user){
    let isValid = await bcrypt.compare(password,user.password);
    
    if(isValid){
      
      let token = jwt.sign({username : username},secret_key);
      req.session.token = token;
      
      res.status(202).json({message : "access given",status:true});
    }
    else
    res.status(401).json({message : "invalid username or password",status:false});
    }
    else{
      res.status(404).json({message : "no such user found"});
    }
});

module.exports = route;