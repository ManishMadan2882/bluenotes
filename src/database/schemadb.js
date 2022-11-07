const mongoose = require('mongoose');

require("./connect");

const schema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    links : {
        type : Array,
        default : []
    }
});
const user = new mongoose.model("user",schema);

module.exports = user;