
const port = 3000 || process.env.PORT;

const express = require('express');

const path = require('path');

const app = express();

const routerFile = require('../src/routes/route');

app.use('/',routerFile);

app.listen(port , () => {

    console.log(`Server running at port : ${port}`);

});