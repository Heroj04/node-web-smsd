const http = require('http');
const log = require('loglevel').getLogger('server');
const config = require('./config');

// Create a listener function
function requestListener(req, res) {
  log.debug('Request made', req);
  res.writeHead(200);
  res.end('My first server!');
}

// Create a server
const server = http.createServer(requestListener);

// Start the server listening on the configured host and port
server.listen(config.server.port, config.server.host, () => {
  log.info(`Server is listening on http://${config.server.host}:${config.server.port}`);
});

log.debug('Module Loaded');
