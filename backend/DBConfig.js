const mysql = require('mysql');

const pool = mysql.createPool({
//   connectionLimit: 10, // Adjust the connection limit as needed
  host: '127.0.0.1',
  user: 'root',
  password: 'RootUser',
  // database: 'eventi' // Replace with your actual database name
});

module.exports = pool;