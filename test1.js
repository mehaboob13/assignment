const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Set up SQLite database
const db = new sqlite3.Database(':memory:'); // Use in-memory database for simplicity

// Create logs table
db.serialize(() => {
  db.run('CREATE TABLE logs (id INTEGER PRIMARY KEY, level TEXT, message TEXT, resourceId TEXT, timestamp TEXT, traceId TEXT, spanId TEXT, commit TEXT, parentResourceId TEXT)');
});

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Endpoint for log ingestion
app.post('/ingest', (req, res) => {
  const log = req.body;

  // Insert log into the database
  const stmt = db.prepare('INSERT INTO logs (level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(
    log.level,
    log.message,
    log.resourceId,
    log.timestamp,
    log.traceId,
    log.spanId,
    log.commit,
    log.metadata ? log.metadata.parentResourceId : null
  );
  stmt.finalize();

  res.send('Log ingested successfully.');
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Log Ingestor listening at http://localhost:${port}`);
});
