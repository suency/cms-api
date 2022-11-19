const express = require('express');
const testRouter = express.Router();
const config = require('@/config.js')
const cache = require('memory-cache');

testRouter.use((req, res, next) => {
    console.log('gengtest general middleware');
    next();
});

testRouter.get('/', (req, res) => {
    const connection = config.createConnection();
    console.log(66666);
    let sql = "select * from users";
    connection.query(sql, (err, rows, fields) => {
        cache.put('gengCache', 'cashValue', 100000, function (key, value) {
            console.log(key + ' did ' + value);
        });
        console.log(rows);
        res.send(JSON.stringify(rows))
    });
    connection.end();
});

module.exports = testRouter;