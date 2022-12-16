const http = require('http');
const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const args = require('args');

// Set up any program arguments
args.options([
  {
    name: 'logLevel',
    description: 'Sets the logging level for the current process, overriding the config file.',
  },
]);
const flags = args.parse(process.argv);

// Set up the logger
prefix.reg(log);
prefix.apply(log, { template: '[%t] %l (%n):' });
log.setLevel(flags.logLevel ?? log.levels.ERROR);

// Get our config
const config = require('./lib/config');

// Update the logger to use the configured logLevel
log.getLogger('config').setLevel(flags.logLevel ?? config.logLevel);
log.setLevel(flags.logLevel ?? config.logLevel);

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
  log.info(`Server is running on http://${config.server.host}:${config.server.port}`);
});
