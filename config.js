const mysql = require('mysql');

module.exports = {
  createConnection: () => mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'cms',
    port: '13306'
  }),
  secretKey: 'random_secret_3938$6&^!#',
  expiresIn: '12220s'
}
