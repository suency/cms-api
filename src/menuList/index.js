const express = require('express');
const menuList = express.Router();
const config = require('@/config.js')
const jwt = require("jsonwebtoken");

const handleData = require("@/tools/handleData.js");


// middleware that is specific to this router
menuList.use((req, res, next) => {
  console.log('menuList general middleware');
  next();
});
// define the home page route
menuList.post('/', (req, res) => {

  const connection = config.createConnection();
  if(!req.body.role){
    res.send(handleData.responseJSON(false, {
      error: "role is not right"
    }))
  }
  connection.query(`SELECT menu_list FROM  roles where roles.name = '${req.body.role}'`, (err, rows, fields) => {
    const result = JSON.parse(JSON.stringify(rows));
    if(result.length!==0){
      res.send({
        info:{
          menuList:JSON.parse(result[0].menu_list),
        },
        status: "OK"
      })
    }else{
      res.send(handleData.responseJSON(false, {
        error: "role is not right, redirect to login page"
      }))
    }

  })
connection.end()
});

module.exports = menuList;
