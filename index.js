const http = require('http');
const config = require('./lib/config');

function requestListener(req, res) {
  res.writeHead(200);
  res.end('My first server!');
}

const server = http.createServer(requestListener);

server.listen(config.server.port, config.server.host, () => {
  console.log(`Server is running on http://${config.server.host}:${config.server.port}`);
});
