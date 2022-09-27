const express = require('express');
const loginRouter = express.Router();
const config = require('@/config.js')
const jwt = require("jsonwebtoken");

const handleData = require("@/tools/handleData.js");


// middleware that is specific to this router
loginRouter.use((req, res, next) => {
  console.log('login general middleware');
  next();
});
// define the home page route
loginRouter.post('/', (req, res) => {
  //connection.query(`select * from users where username = ${req.body.username} and password=${req.body.password}`
  const connection = config.createConnection();
  //console.log(req.get("Authorization")) get header info by get Method
  connection.query(`select router_list,name from roles where id = (select role_id from users where username = '${req.body.username}' and password = '${req.body.password}') `, (err, rows, fields) => {
    const result = JSON.parse(JSON.stringify(rows));
    //console.log(result)
    if (result.length == 0) {
      res.send(handleData.responseJSON(false, {
        error: "Username or password is wrong!!!"
      }))
    } else {
      const tokenStr = 'Bearer ' + jwt.sign({
        username: req.body.username,
        currentTime: new Date()
      }, config.secretKey, {
        expiresIn: config.expiresIn,
      });

      res.send({
        info:{
          //routerList:JSON.parse(result[0].menu_list),
          routerList:JSON.parse(result[0].router_list),
          token: tokenStr,
          role: result[0].name
        },
        status: "OK"
      })
    }
    //console.log(JSON.parse(JSON.stringify(rows)))
  })
  connection.end()


});
// define the about route
loginRouter.get('/register', (req, res) => {
  console.log(req.body);
  res.send('register');
});

loginRouter.post('/test', (req, res) => {
  res.send('test');
});


module.exports = loginRouter;
