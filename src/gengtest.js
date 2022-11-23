const express = require('express');
const testRouter = express.Router();
const config = require('@/config.js')
const cache = require('memory-cache');

testRouter.use((req, res, next) => {
    console.log('gengtest general middleware');
    next();
});

//just for tesing menu and router
testRouter.get('/json', (req, res) => {
    const connection = config.createConnection();
    let sql = "select * from roles where id = 1";
    connection.query(sql, (err, rows, fields) => {
        let result = rows;
        //JSON.parse(Object.values(JSON.parse(JSON.stringify(rows)))[0][0].tree)
        result[0].menu_list = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows)))[0].menu_list)
        result[0].router_list = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows)))[0].router_list)
        res.send(result)
    });
    connection.end();
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