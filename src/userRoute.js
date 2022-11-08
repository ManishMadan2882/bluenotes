 require('dotenv').config();

const path = require('path');
const express = require('express')
const Route = express.Router();
require('../database/connect');
const db = require('../database/schemadb');
const session = require('express-session');

Route.use(express.static(path.join(__dirname,'../../public')));
Route.use(express.urlencoded({extended:false}));
Route.use(express.json());

Route.get('/',(req,res) =>{
    res.send('connkhbhknkjk')
    
});
Route.get('/:username',(req,res) => {
    res.send(req.params.username);
})

module.exports  =  Route; 