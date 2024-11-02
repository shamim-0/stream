const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root',
  password: '',
  database: 'stream'
});

module.exports = pool.promise();
