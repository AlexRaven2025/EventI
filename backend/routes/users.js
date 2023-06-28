var express = require('express');
var router = express.Router();
var pool = require('../DBConfig.js');
var cors = require('cors');
router.use(cors());
// -----All routes are starting with /users-----
// POST route to create a new user
router.post('/', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
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
// -------------------------------------------------------------------------------------
router.post('/verify', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var username = req.body.username; // Assuming the username is sent in the request body
  var password = req.body.password; // Assuming the password is sent in the request body

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
        // User exists
        var storedPassword = results[0].password; // Assuming the password is stored in a column called "password"

        if (password === storedPassword) {
          // Password matches
          return res.status(200).json({ message: 'User verified' });
        } else {
          // Password does not match
          return res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        // User does not exist
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
});
module.exports = router;
