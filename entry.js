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

// CORS policy
app.use(require('cors')());

/* app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
}) */

//image assets
app.use('/static', express.static('static/head'))

//post body-type json type
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//auth
app.use(
  expressjwt({
    secret: config.secretKey,
    algorithms: ["HS256"]
  }).unless({
    path: ["/login", "/login/register", /\/gengtest.*/, /\/app1\/.*/] // no need to auth route
  })
);

//list of modules in src folder, one forder one module
//e.g. if match /login router, it will go to the login folder and execuate the function!
app.use('/login', require('./src/login'));
app.use('/menuList', require('./src/menuList'));
app.use('/roles', require('./src/roles'));
app.use('/gengtest', require('./src/gengtest.js'));

app.use('/auth', require('./src/auth.js'));

//mutiple app backend inteface
app.use('/app1', require('./src/apps/app1'));


//{"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"TokenExpiredError","message":"jwt expired","expiredAt":"2022-11-19T01:52:58.000Z"}}
//{"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"JsonWebTokenError","message":"invalid algorithm"}}
//{"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"JsonWebTokenError","message":"invalid token"}}


// global error catcher, for JWT error
// put it in the last
app.use((err, req, res, next) => {
  // token fail
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: err.status,
      message: err.inner,
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
