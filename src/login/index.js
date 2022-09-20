const express = require('express');
const loginRouter = express.Router();
const config = require('@/config.js')

// middleware that is specific to this router
loginRouter.use((req, res, next) => {
  console.log('login general middleware');
  next();
});
// define the home page route
loginRouter.get('/', (req, res) => {
  res.send('login index');
});
// define the about route
loginRouter.get('/register', (req, res) => {
  res.send('register');
});



const mysql = require('mysql')
const connection = mysql.createConnection(config.db)

connection.connect()

connection.query('select * from users', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows)
})

connection.end()

module.exports = loginRouter;
