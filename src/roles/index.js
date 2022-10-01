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
  console.log("okokokokok")
  connection.query(`UPDATE roles SET menu_list='${req.body.resultMenu}',router_list='${req.body.resultRouter}' WHERE id='${req.body.roleId}'`, (err, rows, fields) => {
    const result = JSON.parse(JSON.stringify(rows));
    if (result.length !== 0) {
      res.send({
        info: {
          result,
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
roles.post('/createRole', (req, res) => {

  const connection = config.createConnection();
  console.log("create role")
  connection.query(`select * from roles where name = '${req.body.newRoleName}'`, (e, r, f) => {
    const resultExist = JSON.parse(JSON.stringify(r));
    if (resultExist.length !== 0) {
      res.send(handleData.responseJSON(false, {
        error: "role exist, please change another one!"
      }))
    } else {
      connection.query(`insert into roles(name,menu_list,router_list,avatar) values(
          '${req.body.newRoleName}',
          '${req.body.newMenu}',
          '${req.body.newRouter}',
          '${req.body.newRoleIcon}')`, (err, rows, fields) => {
        //const result = JSON.parse(JSON.stringify(rows));
        console.log("rows", rows)
        console.log("err", err)
        if (rows) {
          res.send({
            info: {
              result: "nb",
            },
            status: "OK"
          })
        } else {
          res.send(handleData.responseJSON(false, {
            error: "system error role creation"
          }))
        }

        connection.end()
      })
    }
  })
  //connection.end()
});

roles.post('/updateRoleName', (req, res) => {

  const connection = config.createConnection();

  connection.query(`select * from roles where name = '${req.body.newRoleName}'`, (e, r, f) => {
    const resultExist = JSON.parse(JSON.stringify(r));
    if (resultExist.length !== 0) {
      res.send(handleData.responseJSON(false, {
        error: "role exist, please change another one!"
      }))
    } else {
      connection.query(`UPDATE roles SET name='${req.body.editRoleName}',avatar='${req.body.editRoleIcon}' WHERE id='${req.body.editRoleId}'`, (err, rows, fields) => {
        const result = JSON.parse(JSON.stringify(rows));
        if (result.length !== 0) {
          res.send({
            info: {
              result,
            },
            status: "OK"
          })
        } else {
          res.send(handleData.responseJSON(false, {
            error: "system error role edit"
          }))
        }
        connection.end()
      })
    }
  })

});

roles.post('/deleteRole', (req, res) => {
  const connection = config.createConnection();
  connection.query(`DELETE from roles where id = '${req.body.id}'`, (err, rows, fields) => {
    if (rows) {
      res.send({
        info: {
          result: "delete ok",
        },
        status: "OK"
      })
    } else {
      res.send(handleData.responseJSON(false, {
        error: "system error role deleting"
      }))
    }

  })
  connection.end()
})


roles.post('/test', (req, res) => {

  res.send({
    "a": "b"
  })
});

module.exports = roles;
