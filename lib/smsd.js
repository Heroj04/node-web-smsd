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

function serializeGSM(gsm) {
  const { headers, payload } = gsm;

  // Test what the payload type is
  if (headers.Alphabet) {
    // Do nothing -- Alphabet already set
  } else if (typeof payload === 'string') {
    headers.Alphabet = isoValidator(payload) ? 'ISO' : 'UCS2';
  } else {
    headers.Alphabet = 'binary';
  }

  // Convert the message to a buffer
  let payloadBuffer;
  switch (headers.Alphabet) {
    case 'ISO':
      payloadBuffer = Buffer.from(payload, 'latin1');
      break;
    case 'UCS2':
      payloadBuffer = Buffer.from(payload, 'ucs2');
      break;
    case 'binary':
      payloadBuffer = payload;
      break;
    default:
      break;
  }

  // Convert all the headers to strings seperated by ': ' and make that a buffer
  let headersString = '';
  Object.keys(gsm.headers).forEach((header) => {
    const value = gsm.headers[header];
    headersString += `${header}: ${value}\n`;
  });
  headersString += '\n';
  const headersBuffer = Buffer.from(headersString, 'latin1');

  // Return a buffer with the headers and payload joined
  return Buffer.concat([headersBuffer, payloadBuffer]);
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
    const content = serializeGSM({
      headers: {
        To: toNumber,
      },
      payload: message,
    });
    await fs.writeFile(path.join(config.paths.outgoing, `send_${makeid(10)}`), content);
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
  serializeGSM,
};

log.debug('Module Loaded');
