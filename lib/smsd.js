const fs = require('fs');
const path = require('path');
const log = require('loglevel').getLogger('smsd');
const config = require('./config');

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function send(toNumber, message, callback) {
  log.debug('Sending message', toNumber);
  fs.writeFile(path.join(config.paths.outgoing, `send_${makeid(10)}`), `To: ${toNumber}\n\n${message}`, (error) => {
    if (error) {
      log.error('Failed to send message', toNumber, error);
    } else {
      log.info('Successfully sent message', toNumber);
    }
    if (callback) {
      callback(error);
    }
  });
}

module.exports = {
  send,
};

log.debug('Module Loaded');
