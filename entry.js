const express = require('express');
const app = express();
const config = require('./config.js')

// rename the root directory using @
require('module-alias/register')
const port = 8888;

//jwt
const {
  expressjwt
} = require("express-jwt");

//post body-type json type
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//auth
app.use(
  expressjwt({
    secret: config.secretKey,
    algorithms: ["HS256"]
  }).unless({
    path: ["/login", "/login/register"] // no need to auth route
  })
);

//list of modules in src folder, one forder one module
//e.g. if match /login router, it will go to the login folder and execuate the function!
app.use('/login', require('./src/login'));


// global error catcher, for JWT error
// put it in the last
app.use((err, req, res, next) => {
  // token fail
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 401,
      message: "invalid token",
    });
  }
  res.send({
    status: 500,
    message: "unknown error",
  });
});


app.listen(port, () => {
  console.log(`api is ready at port: ${port}`)
})
