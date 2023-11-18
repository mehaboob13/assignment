const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001; // Different port for the query interface

// Set up SQLite database
const db = new sqlite3.Database(':memory:'); // Use in-memory database for simplicity

// Middleware to parse JSON in the request body
app.use(express.json());

// Endpoint for full-text search and filters
app.get('/search', (req, res) => {
  const { query, level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId } = req.query;

  let sql = 'SELECT * FROM logs WHERE 1=1';

  // Add filters to the SQL query
  if (level) sql += ` AND level='${level}'`;
  if (message) sql += ` AND message LIKE '%${message}%'`;
  if (resourceId) sql += ` AND resourceId='${resourceId}'`;
  if (timestamp) sql += ` AND timestamp='${timestamp}'`;
  if (traceId) sql += ` AND traceId='${traceId}'`;
  if (spanId) sql += ` AND spanId='${spanId}'`;
  if (commit) sql += ` AND commit='${commit}'`;
  if (parentResourceId) sql += ` AND parentResourceId='${parentResourceId}'`;

  // Execute the SQL query
  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

// Start the HTTP server for the query interface
app.listen(port, () => {
  console.log(`Query Interface listening at http://localhost:${port}`);
});
