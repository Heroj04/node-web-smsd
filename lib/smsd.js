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

function getSent(callback) {
  // Read the sent directory and list all files inside
  fs.readdir(config.paths.sent, (readDirError, files) => {
    // Check for directory reading errors
    if (readDirError) {
      log.error('Failed to read sent messages directory', readDirError);
      callback([]);
      return;
    }
    const messages = [];
    files.forEach((filePath) => {
      fs.readFile(filePath, (readFileError, data) => {
        if (readFileError) {
          log.error('Failed to read file', filePath, readFileError);
          return;
        }
        const message = {
          from: null,
          sent: null,
          received: null,
          message: null,
        };
        let messageStarted = false;
        data.toString().split('\n').forEach((line) => {
          if (messageStarted) {
            message.message += `${message ? '\n' : ''}${line}`;
            return;
          }
          if (line.startsWith('From: ')) {
            message.from = line.substring(6);
            return;
          }
          if (line.startsWith('Sent: ')) {
            message.sent = Date.parse(line.substring(6));
            return;
          }
          if (line.startsWith('Received: ')) {
            message.received = Date.parse(line.substring(10));
            return;
          }
          if (line === '') {
            messageStarted = true;
          }
        });
        messages.push(message);
      });
    });
    callback(messages);
  });
}

module.exports = {
  send,
  getSent,
};

log.debug('Module Loaded');
