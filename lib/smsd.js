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

function isoValidator(str) {
  // eslint-disable-next-line no-control-regex
  return !/[^\u0000-\u00ff]/g.test(str);
}

function parseGSM(gsm) {
  const headers = {};
  let payload = null;
  const payloadSplit = gsm.indexOf('A0A0', 'hex');

  // Seperate the headers and payload
  const headerString = gsm.subArray(0, payloadSplit).toString('utf8');
  headerString.split('\n').forEach((line) => {
    // For each header, put into header object
    const seperatorIndex = line.indexOf(': ');
    const key = line.substring(0, seperatorIndex);
    const value = line.substring(seperatorIndex + 2);
    headers[key] = value;
  });

  // Get payload based on Alphabet header
  switch (headers.Alphabet) {
    case 'ISO':
      payload = gsm.subarray(payloadSplit + 2).toString('latin1');
      break;
    case 'UCS2':
      payload = gsm.subarray(payloadSplit + 2).toString('ucs2');
      break;
    case 'binary':
      payload = gsm.subarray(payloadSplit + 2);
      break;
    default:
      break;
  }

  // Return an object containing the headers and payload
  return {
    headers,
    payload,
  };
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
        messages.push(parseGSM(data));
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
