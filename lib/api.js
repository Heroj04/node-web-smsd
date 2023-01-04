const log = require('loglevel').getLogger('api');
const config = require('./config');
const smsd = require('./smsd');

function getIncoming() {
  return {
    messages: smsd.getIncoming(),
  };
}

function getOutgoing() {
  return {
    messages: smsd.getOutgoing(),
  };
}

function getSent() {
  return {
    messages: smsd.getSent(),
  };
}

function getChecked() {
  return {
    messages: smsd.getChecked(),
  };
}

function getFailed() {
  return {
    messages: smsd.getFailed(),
  };
}

function send() {
  return {};
}

const routes = [
  {
    name: 'get',
    subRoutes: [
      {
        name: 'incoming',
        command: getIncoming,
      },
      {
        name: 'outgoing',
        command: getOutgoing,
      },
      {
        name: 'sent',
        command: getSent,
      },
      {
        name: 'checked',
        command: getChecked,
      },
      {
        name: 'failed',
        command: getFailed,
      },
    ],
  },
  {
    name: 'authentication',
    subRoutes: [
      {
        name: 'login',
      },
      {
        name: 'logout',
      },
    ],
  },
  {
    name: 'send',
    command: send,
  },
];

module.exports = {
  routes,
};

log.debug('Module Loaded');
