const express = require('express');
const loginRouter = express.Router();
const config = require('@/config.js')
const jwt = require("jsonwebtoken");

// middleware that is specific to this router
loginRouter.use((req, res, next) => {
  console.log('login general middleware');
  next();
});
// define the home page route
loginRouter.get('/', (req, res) => {
  const tokenStr = jwt.sign({
    username: "fei",
    currentTime: new Date()
  }, config.secretKey, {
    expiresIn: config.expiresIn,
  });
  res.send('login index token is:' + tokenStr);
});
// define the about route
loginRouter.get('/register', (req, res) => {
  res.send('register');
});


module.exports = loginRouter;
