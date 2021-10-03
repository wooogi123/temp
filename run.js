const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((req, res) =>
  handler(req, res, { public: '.' }));

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
