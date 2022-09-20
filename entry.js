const express = require('express');
const app = express();

// rename the root directory using @
require('module-alias/register')
const port = 8888;

//list of modules in src folder, one forder one module
//e.g. if match /login router, it will go to the login folder and execuate the function!
app.use('/login', require('./src/login'));

app.listen(port, () => {
  console.log(`api is ready at port: ${port}`)
})
