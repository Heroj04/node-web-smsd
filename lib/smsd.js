const fs = require('fs').promises;
const path = require('path');
const log = require('loglevel').getLogger('smsd');
const config = require('config').get('SMSD');

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
  const payloadSplit = gsm.indexOf('A0A0', 0, 'hex');

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

async function readGSMDir(directory) {
  // Read the directory and list all files
  const files = await fs.readdir(directory);

  // For each file read it and return its value
  const promises = [];
  files.forEach(promises.push(async (filePath) => {
    log.debug('Read file', filePath);
    try {
      const data = await fs.readFile(filePath);
      const message = parseGSM(data);
      return message;
    } catch (error) {
      log.error('Failed to read file', filePath, error);
      throw error;
    }
  }));

  // Wait for all files to be read
  const results = await Promise.allSettled(promises);

  // Filter the successful results
  const succeeded = results.filter((result) => result.status === 'fulfilled');
  const succeededValues = succeeded.map((result) => result.value);

  // Filter the failed results. These are already logged above
  // const failed = results.filter((result) => result.status === 'rejected');

  // return the read messages
  return succeededValues;
}

async function send(toNumber, message) {
  log.debug('Sending message', toNumber);
  try {
    // Write a new GSM File to the outgoing path
    // TODO - Move message serialising to its own function
    await fs.writeFile(path.join(config.paths.outgoing, `send_${makeid(10)}`), `To: ${toNumber}\n\n${message}`);
  } catch (error) {
    log.error('Failed to send message', toNumber, error);
    throw error;
  }
  log.info('Successfully sent message', toNumber);
}

async function getIncoming() {
  // Read the incoming directory and list all files inside
  return readGSMDir(config.paths.incoming);
}

async function getOutgoing() {
  // Read the outgoing directory and list all files inside
  return readGSMDir(config.paths.outgoing);
}

async function getSent() {
  // Read the sent directory and list all files inside
  return readGSMDir(config.paths.sent);
}

async function getChecked() {
  // Read the checked directory and list all files inside
  return readGSMDir(config.paths.checked);
}

async function getFailed() {
  // Read the failed directory and list all files inside
  return readGSMDir(config.paths.failed);
}

module.exports = {
  send,
  getIncoming,
  getOutgoing,
  getSent,
  getChecked,
  getFailed,
  readGSMDir,
  parseGSM,
};

log.debug('Module Loaded');
