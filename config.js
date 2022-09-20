const mysql = require('mysql');

module.exports = {
  createConnection: () => mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cms'
  }),
  secretKey: 'random_secret_3938$6&^',
  expiresIn: '3600s'
}
