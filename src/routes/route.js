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
const mongoStore = require('connect-mongo');
const auth = require('../routes/auth');
route.use(express.static(path.join(__dirname,'../../public')));
route.use(express.urlencoded({extended:false}));
route.use(express.json());
route.use(session({
  resave : false,
  saveUninitialized:true,
  cookie:{maxAge : Number(process.env.AGE)},
  secret: String(secret_key),
  store:mongoStore.create({mongoUrl : process.env.mongourl})
}));

route.get('/',(req,res) => {
  res.status(200).sendFile(path.join(__dirname,"../../public/home/index.html"));
})
//-------------Sign up--------------------
route.get('/signup' , (req,res) =>{
 res.status(200).sendFile(path.join(__dirname,"../../public/signup/index.html"));
});
route.post('/signup', async (req,res) => {
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

route.get('/edit/:username',auth, (req,res) => {
  if(req.isValid)
  res.status(200).sendFile(path.join(__dirname,"..",'../public/editFolder/index.html'))
  else res.redirect(`/user/${req.params.username}`);
});
route.get('/user/:username', async (req,res) => {
  res.sendFile(path.join(__dirname,"..",'../public/public-user/index.html'))
})
route.get('/api/:username',async (req,res) =>{
  const currentUser = await db.findOne({username : req.params.username});
  const editableUsername = jwt.decode(req.session.token,secret_key).username;
  if(!currentUser)
  res.status(404).json({message : "Oops ! no such user"});
  else{
     if(editableUsername === currentUser.username)
     res.status(200).json({username : currentUser.username , links : currentUser.links, isEditable : true});
     else
     res.status(200).json({username : currentUser.username , links : currentUser.links, isEditable : false});
     

  }
   
});
route.patch('/api/:username/edit',auth,async (req,res) => {
if(req.isValid ){
  const currentUser = await db.findOne({username : req.params.username});
  if(!currentUser)
  res.status(404).json({message : "Oops ! no such user"});
  else{
      currentUser.links = req.body.links;
      currentUser.save();
      res.status(201).json({message : "updated"})
  }
}
else{
  res.status(403).json({message : 'unauthorized'});
}
})
module.exports = route;
