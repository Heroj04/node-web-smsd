const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const config = require('config');

// Set up the logger
prefix.reg(log);
prefix.apply(log, { template: '[%t] %l (%n):' });
log.setLevel(config.get('logLevel'));

// Load the web server
require('./lib/server');

log.debug('Module Loaded');
