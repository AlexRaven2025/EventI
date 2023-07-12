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

// --------------------------User-SignOut------------------------------------------------------------
router.post('/profile/signout', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var userID = req.headers.user_id;
  
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }
    
    var updateQuery = 'UPDATE eventi.users SET user_state = false WHERE user_id = ?';

    connection.query(updateQuery, [userID], function(err, result) {
      connection.release();
      
      if (err) {
        console.log('Failed to update user state:', err);
        return res.status(500).json({ error: 'Failed to update user state' });
      }
      
      res.status(200).json({ message: 'User signed out successfully' });
    });
  });
});


// ----------------------------------------------------------------------------------------------------
// ---------------------------user-Profile-route-------------------------------------------------------
// ---------------------------GET-User-Created-Events--------------------------------------------------
router.get('/profile', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var userID = req.headers.user_id; // Assuming the userID is sent in the request headers
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Fetch the events associated with the user from the database
    connection.query('SELECT * FROM eventi.events WHERE user_id = ?', [userID], function(err, eventResults) {
      if (err) {
        console.log('Database query failed:', err);
        connection.release();
        return res.status(500).json({ error: 'Database query failed' });
      }

      // Fetch the event IDs associated with the user from the event_rsvped table
      connection.query('SELECT event_id FROM eventi.event_rsvps WHERE user_id = ?', [userID], function(err, eventIDResults) {
        if (err) {
          console.log('Database query failed:', err);
          connection.release();
          return res.status(500).json({ error: 'Database query failed' });
        }

        // Extract the event IDs from the result
        const eventIDs = eventIDResults.map((result) => result.event_id);

        if (eventIDs.length === 0) {
          // No rsvped events found for the user
          connection.release();
          return res.status(200).json({ events: eventResults, rsvped_events: [] });
        }

        // Fetch the rsvped events associated with the user from the events table
        connection.query('SELECT * FROM eventi.events WHERE event_id IN (?)', [eventIDs], function(err, rsvpedEventResults) {
          if (err) {
            console.log('Database query failed:', err);
            connection.release();
            return res.status(500).json({ error: 'Database query failed' });
          }

          connection.release(); // Release the connection after the inner query is executed

          console.log(eventResults, rsvpedEventResults); // Logging the correct variable name

          // Send the user and event data as a JSON response
          res.status(200).json({ events: eventResults, rsvped_events: rsvpedEventResults });
        });
      });
    });
  });
});

// ---------------------------Create-User-Event------------------------------------------------

router.post('/profile/create', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  // Assuming the userID and input values are received in the request body
  var userID = req.headers.user_id;
  var name = req.body.name;
  var description = req.body.description;
  var location = req.body.location;
  var time = req.body.time;

  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Check the user_state in the database
    var checkUserQuery = 'SELECT user_state FROM eventi.users WHERE user_id = ?';
    connection.query(checkUserQuery, [userID], function(err, userResult) {
      if (err) {
        console.log('Failed to fetch user details:', err);
        connection.release();
        return res.status(500).json({ error: 'Failed to fetch user details' });
      }

      // Check if the user_state is true
      if (userResult.length > 0 && userResult[0].user_state) {
        // Retrieve the highest event_id number
        var getHighestEventIdQuery = 'SELECT MAX(event_id) AS max_event_id FROM eventi.events;';
        connection.query(getHighestEventIdQuery, function(err, maxEventIdResult) {
          if (err) {
            console.log('Failed to fetch highest event_id:', err);
            connection.release();
            return res.status(500).json({ error: 'Failed to fetch highest event_id' });
          }

          // Generate a new unique event_id by incrementing the highest event_id by 1
          var newEventId = maxEventIdResult[0].max_event_id + 1;

          // Construct the SQL query with placeholders
          var sqlQuery = 'INSERT INTO eventi.events (event_id, event_name, event_description, event_location, event_time, user_id) VALUES (?, ?, ?, ?, ?, ?);';

          // Execute the SQL query with the input values
          connection.query(sqlQuery, [newEventId, name, description, location, time, userID], function(err, results) {
            connection.release(); // Release the database connection

            if (err) {
              console.log('Failed to create event:', err);
              return res.status(500).json({ error: 'Failed to create event' });
            }

            // Return a success response
            res.status(200).json({ message: 'Event created successfully' });
          });
        });
      } else {
        connection.release(); // Release the database connection
        // Return a response asking the user to login
        res.status(401).json({ error: 'Please login to perform this action' });
      }
    });
  });
});


// ---------------------------------Remove Events-------------------------------

router.delete('/profile/remove', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  var userID = req.body.userID;
  var eventName = req.body.eventName;

  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    // Construct the SQL query to select the event based on user ID and event name
    var sqlQuery = 'SELECT * FROM eventi.events WHERE user_id = ? AND event_name = ?';

    // Execute the SQL query with the user ID and event name parameters
    connection.query(sqlQuery, [userID, eventName], function(err, results) {
      if (err) {
        console.log('Failed to fetch event:', err);
        connection.release();
        return res.status(500).json({ error: 'Failed to fetch event' });
      }

      // Check if the event exists
      if (results.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Event not found' });
      }

      // Event found, proceed with deletion
      var deleteQuery = 'DELETE FROM eventi.events WHERE user_id = ? AND event_name = ?';
      connection.query(deleteQuery, [userID, eventName], function(err, deleteResult) {
        connection.release();

        if (err) {
          console.log('Failed to delete event:', err);
          return res.status(500).json({ error: 'Failed to delete event' });
        }

        // Check if any rows were affected by the delete query
        if (deleteResult.affectedRows === 0) {
          return res.status(500).json({ error: 'Failed to delete event' });
        }

        // Return a success response
        res.status(200).json({ message: 'Event deleted successfully' });
      });
    });
  });
});

module.exports = router;
