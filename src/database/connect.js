require('dotenv').config();

const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.mongourl)
.then( () => {
    console.log("Connection with database : success");
}) 
.catch((err) => {
    console.log('Connection with database : failure');
})