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
// NOTE - Config Module will log at info level unless logLevel flag is specified
prefix.reg(log);
prefix.apply(log, { template: '[%t] %l (%n):' });
log.setLevel(flags.logLevel ?? log.levels.ERROR);

// Get our config
const config = require('./lib/config');

// Update the logger to use the configured logLevel
log.getLogger('config').setLevel(flags.logLevel ?? config.logLevel);
log.setLevel(flags.logLevel ?? config.logLevel);

// Load the web server
const server = require('./lib/server');

log.debug('Module Loaded');
