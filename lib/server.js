const express = require('express');
const log = require('loglevel').getLogger('server');
const config = require('config').get('Server');
const api = require('./api');

const app = express();

// Log any requests
app.use((req, res, next) => {
  log.debug('Request received', req);
  next();
});

// Use API
app.use('/api', api);

// Create a listener function
app.get('/', (req, res) => {
  res.send('Received a GET HTTP method');
});

// Start the server listening on the configured host and port
app.listen(config.port, config.host, () => {
  log.info(`Server is listening on http://${config.host}:${config.port}`);
});

log.debug('Module Loaded');
