const mysql = require('mysql');

module.exports = {
  createConnection: () => mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'cms',
    port: '13306'
  }),
  secretKey: 'random_secret_app1_27)28&=$#',
  expiresIn: '200s'
}
