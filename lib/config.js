const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../');
const configName = 'config.json';
const configPath = path.join(configDir, configName);

// Check if config exists
if (!fs.existsSync(configPath)) {
  fs.copyFileSync(`${configPath}.example`, configPath);
}

// Read the config file
const config = JSON.parse(fs.readFileSync(configPath));

// Set up the config save method
config.save = () => {
  fs.writeFileSync(JSON.stringify(this));
};

// Export the config
module.exports = config;
