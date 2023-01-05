const express = require('express');
const log = require('loglevel').getLogger('server');
const config = require('./config');

const app = express();

// Log any requests
app.use((req, res, next) => {
  log.debug('Request received', req);
  next();
});

// Create a listener function
app.get('/', (req, res) => {
  res.send('Received a GET HTTP method');
});

// Start the server listening on the configured host and port
app.listen(config.server.port, config.server.host, () => {
  log.info(`Server is listening on http://${config.server.host}:${config.server.port}`);
});

log.debug('Module Loaded');
