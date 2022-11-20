const mysql = require('mysql');

module.exports = {
  createConnection: ({ multipleStatements }) => mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'cms',
    port: '13306',
    multipleStatements
  }),
  secretKey: 'random_secret_39%38$6&^!#',
  expiresIn: '7200s'
}
