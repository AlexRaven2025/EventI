const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./DBConfig'); // Import your existing MySQL database connection

// Configuration options for the session store
const sessionStoreOptions = {
  expiration: 86400000, // Session expiration time (in milliseconds), e.g., 24 hours
  createDatabaseTable: true, // Create the sessions table if it doesn't exist
  schema: {
    tableName: 'sessions', // The name of your sessions table
    columnNames: {
      session_id: 'session_id',
      expires: 'expire',
      data: 'data',
    },
  },
};

// Create the session store
const sessionStore = new MySQLStore(sessionStoreOptions, pool);

module.exports = sessionStore;
