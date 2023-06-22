var express = require('express');
var router = express.Router();
var pool = require('../DBConfig.js');
// -----All routes are starting with /users-----
router.get('/', function(req, res, next) {
  res.send('hello world');
});
// POST route to check if a user exists in the database
router.post('/', function(req, res, next) {
  var username = req.body.username; // Assuming the username is sent in the request body

  // Get a connection from the connection pool
  pool.getConnection(function(err, connection) {
    if (err) {
      // Handle database connection error
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Query the database to check if the user exists
    connection.query('SELECT * FROM eventi.users WHERE username = ?', [username], function(err, results) {
      connection.release(); // Release the connection back to the pool

      if (err) {
        // Handle database query error
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length > 0) {
        // User found in the database
        return res.status(200).json({ exists: true });
      } else {
        // User not found in the database
        return res.status(404).json({ exists: false });
      }
    });
  });
});


module.exports = router;
