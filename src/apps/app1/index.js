const express = require('express');
const app1 = express.Router();
const config = require('@/configApp1.js')
const jwt = require("jsonwebtoken");



// middleware that is specific to this router
app1.use((req, res, next) => {
    console.log("app1 router middleware");

    const fromUrl = req.path;
    const unless = ["/login", "/register", "/about", "/test"]
    if (!unless.includes(fromUrl)) {
        let authorization = req.headers.authorization.split(" ")[1];
        console.log(authorization);
        jwt.verify(authorization, config.secretKey, function (err, decoded) {
            //console.log(decoded) // bar
            if (err === null) {
                console.log("ok");
                next();
            } else {
                res.send({ "status": "err", "message": "token is invalid or expired" })
            }
        });
    } else {
        next();
    }


});
// define the home page route
app1.post('/login', (req, res) => {
    const token = 'Bearer ' + jwt.sign({
        username: req.body.username,
        password: req.body.password,
        currentTime: new Date()
    }, config.secretKey, {
        expiresIn: config.expiresIn,
    });
    //console.log(req.body);
    res.send({ "name": req.body.username, token })

});

app1.post('/home', (req, res) => {

    res.send({ "name": "this is home" })

});

module.exports = app1;
