const fs = require('fs');
const path = require('path');
const log = require('loglevel').getLogger('config');

const configDir = path.join(__dirname, '../');
const configName = 'config.json';
const configPath = path.join(configDir, configName);

// Check if config exists
if (!fs.existsSync(configPath)) {
  log.warn('Config file not found, cloning example.');
  fs.copyFileSync(`${configPath}.example`, configPath);
  log.debug('Successfully cloned example config file');
}

// Read the config file
log.debug('Loading config file', configPath);
const config = JSON.parse(fs.readFileSync(configPath));
log.debug('Successfully loaded config file');

// Set up the config save method
config.save = () => {
  log.debug('Saving config file', configPath);
  fs.writeFileSync(JSON.stringify(this));
  log.debug('Successfully saved config file');
};

// Export the config
module.exports = config;

log.debug('Module Loaded');
