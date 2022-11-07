const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://localhost:27017/bluenotes')
.then( () => {
    console.log("Connection with database : success");
}) 
.catch((err) => {
    console.log('Connection with database : failure');
})