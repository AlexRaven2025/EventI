var express = require('express');
var router = express.Router();
var pool = require('../DBConfig.js');
// -----All routes are starting with /users-----
// POST route to create a new user
router.post('/', function(req, res, next) {
  var username = req.body.username; // Assuming the username is sent in the request body
  var password = req.body.password; // Assuming the password is sent in the request body

  // Get a connection from the connection pool
  pool.getConnection(function(err, connection) {
    if (err) {
      // Handle database connection error
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Query the database to check if the user already exists
    connection.query('SELECT * FROM eventi.users WHERE username = ?', [username], function(err, results) {
      if (err) {
        connection.release(); // Release the connection back to the pool
        // Handle database query error
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length > 0) {
        connection.release(); // Release the connection back to the pool
        // User already exists in the database
        return res.status(400).json({ error: 'User already exists' });
      }

      // Insert the new user into the database
      connection.query('INSERT INTO eventi.users (username, password) VALUES (?, ?)', [username, password], function(err, results) {
        connection.release(); // Release the connection back to the pool

        if (err) {
          // Handle database query error
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // User created successfully
        return res.status(201).json({ message: 'User created successfully' });
      });
    });
  });
});

module.exports = router;
