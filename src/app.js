require('dotenv').config();

const serverless = require('serverless-http');

const port = Number(process.env.PORT) || 7000;

const express = require('express');

const path = require('path');

const app = express();

const routerFile = require('../src/routes/route');


app.use('/.netlify/functions/server', routerFile);


app.listen(port , () => {

    console.log(`Server running at port : ${port}`);

});

module.exports.handler = serverless(app);
