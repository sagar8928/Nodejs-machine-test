const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sagar8928',
  database: 'productdb',
});

module.exports = db.promise();
