const express = require('express');
const roles = express.Router();
const config = require('@/config.js')
const jwt = require("jsonwebtoken");

const handleData = require("@/tools/handleData.js");


// middleware that is specific to this router
roles.use((req, res, next) => {
  console.log('roles general middleware');
  next();
});
// define the home page route
roles.get('/getRoles', (req, res) => {
  const connection = config.createConnection();
  connection.query(`SELECT * FROM  roles`, (err, rows, fields) => {
    let result = JSON.parse(JSON.stringify(rows));
    //console.log(result)
    if (result.length !== 0) {
      result.forEach((item, i) => {
        item.menu_list = JSON.parse(item.menu_list)
        item.router_list = JSON.parse(item.router_list)
      });

      res.send({
        info: {
          roles: result
        },
        status: "OK"
      })
    } else {
      res.send(handleData.responseJSON(false, {
        error: "role is not right, redirect to login page"
      }))
    }

  })
  connection.end()
})


roles.post('/updateRole', (req, res) => {

  const connection = config.createConnection();
  if (!req.body.role) {
    res.send(handleData.responseJSON(false, {
      error: "role is not right"
    }))
  }
  connection.query(`SELECT menu_list FROM  roles where roles.name = '${req.body.role}'`, (err, rows, fields) => {
    const result = JSON.parse(JSON.stringify(rows));
    if (result.length !== 0) {
      res.send({
        info: {
          menuList: JSON.parse(result[0].menu_list),
        },
        status: "OK"
      })
    } else {
      res.send(handleData.responseJSON(false, {
        error: "role is not right, redirect to login page"
      }))
    }

  })
  connection.end()
});

module.exports = roles;
