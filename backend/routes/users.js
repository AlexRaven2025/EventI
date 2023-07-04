var express = require('express');
var router = express.Router();
var pool = require('../DBConfig.js');
const cors = require('cors');
const session = require('express-session');
const app = require('../app.js'); // Assuming app.js is in the parent directory
const sessionStore = app.sessionStore;
router.use(session({
 secret: '187380bd17dc54b817c1989e0543665d17a9ccb5',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));
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
    connection.query('SELECT user_id, username, password FROM eventi.users WHERE username = ?', [username], function(err, results) {
      connection.release(); // Release the connection back to the pool

      if (err) {
        // Handle database query error
        console.log('Database query failed:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      console.log('Results:', results);
      if (results.length > 0) {
        // User exists
        var storedPassword = results[0].password; // Assuming the password is stored in a column called "password"

        if (password === storedPassword) {
          // Password matches
          console.log('User verified');
          
          // Store the user_id in the session
          req.session.user_id = results[0].user_id;
          console.log("Session_id -- " + req.session.user_id);
          // Redirect the user to the profile page with JSON data
          // const redirectURL = 'http://localhost:3001/profile?message=User%20verified';
          res.status(200).json({ user_id: results[0].user_id });
        } else {
          // Password does not match
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
  const userId = req.headers['user-id']; // Retrieve the user_id from the custom header
  console.log("User ID:", userId);

  // Fetch the user's data from the database using the provided userId
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('Failed to connect to the database:', err);
      return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    connection.query('SELECT * FROM eventi.users WHERE user_id = ?', [userId], function(err, userResults) {
      connection.release();

      if (err) {
        console.log('Database query failed:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResults[0];

      // Fetch the events associated with the user from the database
      connection.query('SELECT * FROM eventi.events WHERE user_id = ?', [userId], function(err, eventResults) {
        if (err) {
          console.log('Database query failed:', err);
          return res.status(500).json({ error: 'Database query failed' });
        }

        // Send the user and event data as a JSON response
        res.status(200).json({ user, events: eventResults });
      });
    });
  });
});

// ---------------------------------------------------------------------------
// ----------------------------user-profile-image-----------------------------
router.post('/profile/image', function(req, res, next) {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imageFile = req.files.image;

  // Process and store the image file as needed
  // You can use libraries like multer or fs to handle file storage and manipulation

  // Return the image URL or any relevant response
  return res.status(200).json({ message: 'Image uploaded successfully' });
});
module.exports = router;
