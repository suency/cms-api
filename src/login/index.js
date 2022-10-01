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
  let sql = `select * from (select users.username,roles.id as role_id,users.id as user_id,roles.router_list,roles.menu_list,users.avatar as user_avatar,roles.name as role_name from roles, users where roles.id = users.role_id) as info where info.user_id = (select id from users where username = '${req.body.username}' and password = '${req.body.password}')`;
  connection.query(sql, (err, rows, fields) => {
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
        info: {
          id: result[0].user_id,
          routerList: JSON.parse(result[0].router_list),
          menuList: JSON.parse(result[0].menu_list),
          token: tokenStr,
          role: result[0].role_name,
          avatar: result[0].user_avatar,
          username: result[0].username
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
