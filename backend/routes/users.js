var express = require('express');
var router = express.Router();
var pool = require('../DBConfig.js');
const cors = require('cors');
router.use(cors());

// ----------------------------------------------------------------------------------------------------
// ----------------------------All routes are starting with /users-------------------------------------
// ----------------------------POST CREATE NEW USER -----------------------------------------
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

    // Query the database to get the last user_id
    connection.query('SELECT MAX(user_id) AS max_id FROM eventi.users', function(err, results) {
      if (err) {
        connection.release(); // Release the connection back to the pool
        // Handle database query error
        return res.status(500).json({ error: 'Database query failed' });
      }

      var newUserId = results[0].max_id + 1; // Calculate the new user_id

      // Insert the new user into the database
      connection.query('INSERT INTO eventi.users (user_id, username, password) VALUES (?, ?, ?)', [newUserId, username, password], function(err, results) {
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

// ----------------------------------------------------------------------------------------------------
// ------------------------------------VERIFY The User-------------------------------------------------
router.post('/verify', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var username = req.body.username; // Assuming the username is sent in the request body
  var password = req.body.password; // Assuming the password is sent in the request body

  // Get a connection from the connection pool
  pool.getConnection(function(err, connection) {
    if (err) {
      // Handle database connection error
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Query the database to check if the user exists
    connection.query('SELECT username, password FROM eventi.users WHERE username = ?', [username], function(err, results) {
      connection.release(); // Release the connection back to the pool

      if (err) {
        // Handle database query error
        console.log('Database query failed:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length > 0) {
        // User exists
        var storedPassword = results[0].password; // Assuming the password is stored in a column called "password"

        if (password === storedPassword) {
          connection.query('SELECT user_id FROM eventi.users WHERE username = ?', [username], function(err, results) {
            if (err) {
              console.log('Database query failed:', err);
              return res.status(500).json({ error: 'Database query failed' });
            }
            if (results.length > 0) {
              const user_id = results[0].user_id;
              // Send the user_id to the frontend
              res.status(200).json({ user_id });
            } else {
              console.log('User not found');
              return res.status(404).json({ error: 'User not found' });
            }
          });

          // Password matches
          console.log('User verified');
          // Update the user_state column in the users table
          var userState = true;
          connection.query('UPDATE eventi.users SET user_state = ? WHERE username = ?', [userState, username], function(err) {
            if (err) {
              // Handle database update error
              console.log('Failed to update user state:', err);
              return res.status(500).json({ error: 'Failed to update user state' });
            }
          });
        } else {
          // Invalid password
          console.log('Invalid password');
          return res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        // User does not exist
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
});


// ----------------------------------------------------------------------------------------------------
// ---------------------------user-Profile-route-------------------------------------------------------
// ---------------------------GET-User-Created-Events--------------------------------------------------
router.get('/profile', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var userID = req.headers.user_id; // Assuming the userID is sent in the request headers
  console.log(userID);
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    connection.query('SELECT username FROM eventi.users WHERE user_id = ?', [userID], function(err, userResults) {
      if (err) {
        console.log('Database query failed:', err);
        connection.release();
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (userResults.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResults[0];
      console.log(user);

      // Fetch the events associated with the user from the database
      connection.query('SELECT * FROM eventi.events WHERE user_id = ?', [userID], function(err, eventResults) {
        connection.release();
        if (err) {
          console.log('Database query failed:', err);
          return res.status(500).json({ error: 'Database query failed' });
        }

        // Send the user and event data as a JSON response
        res.status(200).json({ user: user.username, events: eventResults });
      });
    });
  });
});


module.exports = router;
